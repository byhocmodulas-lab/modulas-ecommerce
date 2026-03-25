"""
GLTF/GLB Asset Optimization Pipeline
Runs as a headless Blender script or standalone process.

Processes:
1. Import source mesh (OBJ/FBX/STL)
2. Apply mesh cleanup (remove doubles, recalc normals)
3. Generate LOD variants (high/medium/low poly)
4. Optimize textures (resize, compress to KTX2/Basis)
5. Export GLB (web), GLTF (debug), USDZ (iOS AR)
6. Upload to Cloudflare R2 and return file keys
"""

import bpy
import sys
import json
import os
import boto3
from pathlib import Path
from dataclasses import dataclass
from typing import Optional


@dataclass
class OptimizationConfig:
    source_file: str
    product_id: str
    lod_configs: list[dict]  # [{"name": "high", "ratio": 1.0}, {"name": "medium", "ratio": 0.5}, ...]
    texture_max_size: int = 2048
    output_dir: str = "/tmp/modulas-assets"
    r2_bucket: str = "modulas-assets"


@dataclass
class OptimizationResult:
    product_id: str
    glb_key: str
    usdz_key: Optional[str]
    lod_keys: dict[str, str]
    poly_count: int
    file_size_kb: int


def optimize_asset(config: OptimizationConfig) -> OptimizationResult:
    """Main optimization pipeline."""
    os.makedirs(config.output_dir, exist_ok=True)

    # Clear scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Import source mesh
    _import_mesh(config.source_file)

    # Select and clean mesh
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.join()
    active = bpy.context.active_object

    # Cleanup
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.remove_doubles(threshold=0.001)
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.object.mode_set(mode="OBJECT")

    base_poly_count = len(active.data.polygons)
    lod_keys: dict[str, str] = {}

    # Generate LOD variants
    for lod in config.lod_configs:
        lod_obj = _generate_lod(active, lod["ratio"], lod["name"])
        lod_path = f"{config.output_dir}/{config.product_id}_{lod['name']}.glb"
        _export_glb(lod_obj, lod_path)
        lod_keys[lod["name"]] = _upload_to_r2(lod_path, config.r2_bucket, config.product_id)
        # Remove LOD duplicate after export
        bpy.data.objects.remove(lod_obj, do_unlink=True)

    # Export primary GLB (high quality for configurator)
    glb_path = f"{config.output_dir}/{config.product_id}.glb"
    _export_glb(active, glb_path)
    glb_key = _upload_to_r2(glb_path, config.r2_bucket, config.product_id)

    # Export USDZ for iOS AR
    usdz_key = None
    try:
        usdz_path = f"{config.output_dir}/{config.product_id}.usdz"
        _export_usdz(active, usdz_path)
        usdz_key = _upload_to_r2(usdz_path, config.r2_bucket, config.product_id)
    except Exception as e:
        print(f"USDZ export failed (non-critical): {e}")

    file_size_kb = os.path.getsize(glb_path) // 1024

    return OptimizationResult(
        product_id=config.product_id,
        glb_key=glb_key,
        usdz_key=usdz_key,
        lod_keys=lod_keys,
        poly_count=base_poly_count,
        file_size_kb=file_size_kb,
    )


def _import_mesh(filepath: str):
    ext = Path(filepath).suffix.lower()
    import_map = {
        ".obj": bpy.ops.wm.obj_import,
        ".fbx": bpy.ops.import_scene.fbx,
        ".stl": bpy.ops.wm.stl_import,
        ".glb": bpy.ops.import_scene.gltf,
        ".gltf": bpy.ops.import_scene.gltf,
    }
    importer = import_map.get(ext)
    if not importer:
        raise ValueError(f"Unsupported format: {ext}")
    importer(filepath=filepath)


def _generate_lod(source_obj, ratio: float, name: str):
    """Duplicate object and apply decimate modifier for LOD."""
    bpy.ops.object.select_all(action="DESELECT")
    source_obj.select_set(True)
    bpy.ops.object.duplicate()
    lod_obj = bpy.context.active_object
    lod_obj.name = f"{source_obj.name}_LOD_{name}"

    if ratio < 1.0:
        mod = lod_obj.modifiers.new(name="Decimate", type="DECIMATE")
        mod.ratio = ratio
        bpy.ops.object.modifier_apply(modifier=mod.name)

    return lod_obj


def _export_glb(obj, filepath: str):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        use_selection=True,
        export_format="GLB",
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6,
        export_image_format="WEBP",
        export_texcoords=True,
        export_normals=True,
    )


def _export_usdz(obj, filepath: str):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.ops.wm.usd_export(
        filepath=filepath,
        selected_objects_only=True,
        export_textures=True,
    )


def _upload_to_r2(filepath: str, bucket: str, product_id: str) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
    )
    filename = Path(filepath).name
    key = f"models/{product_id}/{filename}"
    s3.upload_file(filepath, bucket, key, ExtraArgs={"ContentType": "model/gltf-binary"})
    return key


if __name__ == "__main__":
    # Called from BullMQ worker: python gltf-optimizer.py <config_json>
    config_json = sys.argv[sys.argv.index("--") + 1]
    raw = json.loads(config_json)
    config = OptimizationConfig(**raw)
    result = optimize_asset(config)
    print(json.dumps(result.__dict__))
