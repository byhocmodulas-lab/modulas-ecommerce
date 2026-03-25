import { requireRole } from "@/lib/auth/session";
import { ProjectsList } from "@/components/architect/projects-list";
import { NewProjectButton } from "@/components/architect/new-project-button";

export const metadata = {
  title: "My Projects — Modulas Architect Portal",
};

export default async function ArchitectProjectsPage() {
  const session = await requireRole("architect", "master_admin", "editor");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-charcoal/55">
            Manage client spaces and furniture selections
          </p>
        </div>
        <NewProjectButton />
      </div>
      <ProjectsList userId={session.id} />
    </div>
  );
}
