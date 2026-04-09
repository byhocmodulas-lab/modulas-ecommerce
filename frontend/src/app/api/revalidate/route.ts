import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.REVALIDATE_SECRET ?? "modulas-revalidate";

const ALL_PATHS = ["/", "/products", "/blog", "/modular-solutions", "/collections"];

/**
 * POST /api/revalidate
 * Body: { secret: string; paths?: string[] }
 *
 * Called by the master admin "Publish" button.
 * Triggers on-demand ISR revalidation so the live site reflects changes immediately.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    if (body.secret !== SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paths: string[] = Array.isArray(body.paths) ? body.paths : ALL_PATHS;

    for (const p of paths) {
      revalidatePath(p, "page");
    }
    // Also revalidate layout so headers/nav pick up changes
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, paths, at: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 },
    );
  }
}

/** GET /api/revalidate?secret=...&path=/ — quick manual trigger */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const path   = searchParams.get("path") ?? "/";

  if (secret !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath(path, "page");
  return NextResponse.json({ revalidated: true, path, at: new Date().toISOString() });
}
