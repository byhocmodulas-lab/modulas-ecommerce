"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PresentationControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";
import { useConfigurator, ConfiguredModule } from "@/lib/stores/configurator-store";
import { cn } from "@/lib/utils/cn";

interface ConfiguratorCanvasProps {
  className?: string;
}

export function ConfiguratorCanvas({ className }: ConfiguratorCanvasProps) {
  const { modules, selectedFinish } = useConfigurator();

  return (
    <div className={cn("relative bg-stone-50", className)}>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <Environment preset="apartment" />

          {/* Render each configured module */}
          {modules.map((module) => (
            <FurnitureModule key={module.id} module={module} finish={selectedFinish} />
          ))}

          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2} />
          <OrbitControls
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

    </div>
  );
}

function FurnitureModule({
  module,
  finish,
}: {
  module: ConfiguredModule;
  finish: string;
}) {
  const { scene } = useGLTF(module.modelUrl);
  // Apply finish material overrides here
  return <primitive object={scene} position={module.position} />;
}
