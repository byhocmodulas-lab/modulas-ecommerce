"use client";

import { useEffect, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import { projectsApi, type Project } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const STATUS_CFG: Record<Project["status"], { label: string; cls: string }> = {
  planning:      { label: "Planning",      cls: "bg-sky-50 border-sky-200 text-sky-700" },
  in_production: { label: "In Production", cls: "bg-amber-50 border-amber-200 text-amber-700" },
  installed:     { label: "Installed",     cls: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  archived:      { label: "Archived",      cls: "bg-black/3 border-black/8 text-charcoal/40" },
};

export function ProjectsList({ userId }: { userId?: string }) {
  const { accessToken } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) { setLoading(false); return; }
    projectsApi.list(accessToken)
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accessToken, userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-charcoal/30" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-black/6 bg-white py-20 text-center">
        <FolderKanban className="mx-auto mb-3 h-10 w-10 text-charcoal/12" />
        <p className="font-sans text-sm text-charcoal/40 mb-1">No projects yet</p>
        <p className="font-sans text-xs text-charcoal/30">Create your first project to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const cfg = STATUS_CFG[project.status];
        return (
          <div key={project.id} className="rounded-2xl border border-black/6 bg-white px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                <FolderKanban className="h-5 w-5 text-gold" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-sm font-medium text-charcoal truncate">{project.name}</p>
                {project.clientName && (
                  <p className="font-sans text-xs text-charcoal/40">{project.clientName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <p className="font-sans text-xs text-charcoal/35 hidden sm:block">
                {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <span className={`rounded-full border px-2.5 py-1 font-sans text-[10px] tracking-[0.08em] uppercase font-medium ${cfg.cls}`}>
                {cfg.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectsList;
