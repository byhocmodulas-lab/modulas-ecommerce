"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Briefcase, GraduationCap, Users, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { applicationsApi, type Application } from "@/lib/api/client";

type AppStatus = "applied" | "shortlisted" | "interviewing" | "offered" | "rejected";
type JobType = "full_time" | "internship";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: JobType;
  location: string;
  openings: number;
  applicants: number;
  posted: string;
  active: boolean;
}

interface Applicant {
  id: string;
  name: string;
  role: string;
  jobId: string;
  status: AppStatus;
  email: string;
  college?: string;
  experience?: string;
  appliedAt: string;
}

const JOB_POSTINGS: JobPosting[] = [
  { id: "j1", title: "Senior Interior Designer", department: "Design", type: "full_time", location: "Mumbai", openings: 2, applicants: 34, posted: "2026-03-01", active: true },
  { id: "j2", title: "Sales Executive — B2B", department: "Sales", type: "full_time", location: "Delhi / Remote", openings: 3, applicants: 18, posted: "2026-03-05", active: true },
  { id: "j3", title: "3D Visualiser", department: "Design", type: "full_time", location: "Bengaluru", openings: 1, applicants: 22, posted: "2026-02-20", active: true },
  { id: "j4", title: "Design Intern — Summer 2026", department: "Design", type: "internship", location: "Mumbai / Hybrid", openings: 4, applicants: 67, posted: "2026-03-10", active: true },
  { id: "j5", title: "Marketing Intern", department: "Marketing", type: "internship", location: "Mumbai", openings: 2, applicants: 41, posted: "2026-03-10", active: true },
  { id: "j6", title: "Operations Manager", department: "Operations", type: "full_time", location: "Mumbai", openings: 1, applicants: 9, posted: "2026-02-10", active: false },
];

const APPLICANTS: Applicant[] = [
  { id: "a1", name: "Tara Mehta", role: "Senior Interior Designer", jobId: "j1", status: "interviewing", email: "tara.m@gmail.com", experience: "5 years, B2B residential", appliedAt: "2026-03-07" },
  { id: "a2", name: "Karan Singh", role: "Senior Interior Designer", jobId: "j1", status: "shortlisted", email: "karan.s@gmail.com", experience: "4 years, commercial fit-out", appliedAt: "2026-03-08" },
  { id: "a3", name: "Rhea D'Souza", role: "Sales Executive — B2B", jobId: "j2", status: "applied", email: "rhea.d@gmail.com", experience: "2 years, interior products", appliedAt: "2026-03-12" },
  { id: "a4", name: "Arjun Kumar", role: "Design Intern — Summer 2026", jobId: "j4", status: "applied", email: "arjun.k@iitb.ac.in", college: "IIT Bombay — B.Des", appliedAt: "2026-03-14" },
  { id: "a5", name: "Priya Nambiar", role: "Design Intern — Summer 2026", jobId: "j4", status: "shortlisted", email: "priya.n@nid.edu", college: "NID Ahmedabad — M.Des", appliedAt: "2026-03-11" },
  { id: "a6", name: "Rohan Gupta", role: "Marketing Intern", jobId: "j5", status: "offered", email: "rohan.g@bits.ac.in", college: "BITS Pilani — MBA", appliedAt: "2026-03-02" },
  { id: "a7", name: "Sana Sheikh", role: "3D Visualiser", jobId: "j3", status: "rejected", email: "sana.s@yahoo.com", experience: "1 year, 3ds Max / V-Ray", appliedAt: "2026-03-01" },
];

const APP_STATUS_CFG: Record<AppStatus, { label: string; cls: string }> = {
  applied:      { label: "Applied",      cls: "text-sky-700 bg-sky-50 border-sky-200" },
  shortlisted:  { label: "Shortlisted",  cls: "text-purple-700 bg-purple-50 border-purple-200" },
  interviewing: { label: "Interviewing", cls: "text-amber-700 bg-amber-50 border-amber-200" },
  offered:      { label: "Offered",      cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  rejected:     { label: "Rejected",     cls: "text-red-600 bg-red-50 border-red-200" },
};

const APP_NEXT: Partial<Record<AppStatus, AppStatus>> = {
  applied:      "shortlisted",
  shortlisted:  "interviewing",
  interviewing: "offered",
};

const DEPARTMENTS = ["Design", "Sales", "Marketing", "Operations", "Technology", "Finance"];

interface NewPostingForm {
  title: string;
  department: string;
  type: JobType;
  location: string;
  openings: number;
}

const BLANK_FORM: NewPostingForm = { title: "", department: "Design", type: "full_time", location: "Mumbai", openings: 1 };

const inputCls = "w-full rounded-lg border border-black/10 bg-white px-3 py-2 font-sans text-sm text-charcoal placeholder:text-charcoal/25 focus:border-black/30 focus:outline-none transition-colors";
const selectCls = `${inputCls} cursor-pointer`;

export default function CareersPage() {
  const { accessToken } = useAuthStore();
  const [tab, setTab]                   = useState<"postings" | "applicants">("postings");
  const [applicants, setApplicants]     = useState(APPLICANTS);
  const [postings, setPostings]         = useState(JOB_POSTINGS);
  const [showNewForm, setShowNewForm]   = useState(false);
  const [newForm, setNewForm]           = useState<NewPostingForm>(BLANK_FORM);

  useEffect(() => {
    if (!accessToken) return;
    applicationsApi.list(accessToken, { type: 'intern', limit: 100 })
      .then((res) => {
        if (res.data.length === 0) return;
        setApplicants(res.data.map((a: Application) => ({
          id: a.id,
          name: a.name,
          role: (a.payload?.role as string) ?? "Design Intern — Summer 2026",
          jobId: (a.payload?.jobId as string) ?? "j4",
          status: (a.status === "reviewing" ? "shortlisted" : a.status === "approved" ? "offered" : a.status === "rejected" ? "rejected" : "applied") as AppStatus,
          email: a.email,
          college: (a.payload?.college as string) ?? undefined,
          experience: (a.payload?.experience as string) ?? undefined,
          appliedAt: a.createdAt.slice(0, 10),
        })));
      })
      .catch(() => {});
  }, [accessToken]);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [expandedJob, setExpandedJob]   = useState<string | null>(null);

  const filteredApplicants = applicants.filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const advance = (id: string, status: AppStatus) => {
    const apiStatus = status === "offered" ? "approved" : status === "rejected" ? "rejected" : "reviewing";
    if (accessToken) {
      applicationsApi.review(accessToken, id, { status: apiStatus as "approved" | "rejected" | "reviewing" }).catch(() => {});
    }
    setApplicants((p) => p.map((a) => a.id === id ? { ...a, status } : a));
  };

  function submitNewPosting() {
    if (!newForm.title.trim() || !newForm.location.trim()) return;
    const posting: JobPosting = {
      id: `j${Date.now()}`,
      title: newForm.title.trim(),
      department: newForm.department,
      type: newForm.type,
      location: newForm.location.trim(),
      openings: newForm.openings,
      applicants: 0,
      posted: new Date().toISOString().slice(0, 10),
      active: true,
    };
    setPostings((p) => [posting, ...p]);
    setNewForm(BLANK_FORM);
    setShowNewForm(false);
    setTab("postings");
  }

  const totalApplicants = postings.reduce((s, j) => s + j.applicants, 0);
  const activePostings  = postings.filter((j) => j.active).length;
  const offeredCount    = applicants.filter((a) => a.status === "offered").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Careers & Interns</h1>
          <p className="font-sans text-sm text-charcoal/35 mt-0.5">{activePostings} active postings · {totalApplicants} total applicants</p>
        </div>
        <button type="button" onClick={() => setShowNewForm((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 font-sans text-[12px] text-charcoal/60 hover:text-charcoal hover:border-black/20 transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Posting
        </button>
      </div>

      {/* New Posting inline form */}
      {showNewForm && (
        <div className="rounded-2xl border border-black/10 bg-amber-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-medium text-charcoal">New Job Posting</h3>
            <button type="button" onClick={() => setShowNewForm(false)} className="text-charcoal/30 hover:text-charcoal/60 transition-colors">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="np-title" className="block font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1">Job Title *</label>
              <input id="np-title" type="text" className={inputCls} placeholder="e.g. Senior Interior Designer"
                value={newForm.title} onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="np-dept" className="block font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1">Department</label>
              <select id="np-dept" title="Department" className={selectCls} value={newForm.department}
                onChange={(e) => setNewForm((f) => ({ ...f, department: e.target.value }))}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="np-type" className="block font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1">Type</label>
              <select id="np-type" title="Job type" className={selectCls} value={newForm.type}
                onChange={(e) => setNewForm((f) => ({ ...f, type: e.target.value as JobType }))}>
                <option value="full_time">Full-time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label htmlFor="np-location" className="block font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1">Location *</label>
              <input id="np-location" type="text" className={inputCls} placeholder="e.g. Mumbai / Remote"
                value={newForm.location} onChange={(e) => setNewForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="np-openings" className="block font-sans text-[10px] uppercase tracking-[0.1em] text-charcoal/40 mb-1">Openings</label>
              <input id="np-openings" type="number" min={1} max={50} title="Number of openings" className={inputCls}
                value={newForm.openings} onChange={(e) => setNewForm((f) => ({ ...f, openings: Math.max(1, Number(e.target.value)) }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={submitNewPosting} disabled={!newForm.title.trim() || !newForm.location.trim()}
              className="h-9 px-6 rounded-full bg-charcoal text-cream font-sans text-[11px] uppercase tracking-[0.1em] hover:bg-charcoal/90 transition-colors disabled:opacity-40">
              Create Posting
            </button>
            <button type="button" onClick={() => setShowNewForm(false)}
              className="h-9 px-4 rounded-full border border-black/10 text-charcoal/50 font-sans text-[11px] uppercase tracking-[0.1em] hover:border-black/20 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}


      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Postings",  value: activePostings, colour: "text-charcoal",      icon: Briefcase },
          { label: "Total Applicants", value: totalApplicants, colour: "text-sky-600",      icon: Users },
          { label: "Offers Extended",  value: offeredCount,   colour: "text-emerald-600",   icon: GraduationCap },
        ].map(({ label, value, colour, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white p-5 flex items-start gap-3">
            <Icon className="h-5 w-5 text-charcoal/20 mt-0.5" />
            <div>
              <p className={`font-serif text-3xl ${colour}`}>{value}</p>
              <p className="font-sans text-xs text-charcoal/35 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-black/8">
        {(["postings", "applicants"] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={["px-5 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase border-b-2 transition-colors -mb-px",
              tab === t ? "border-charcoal text-charcoal" : "border-transparent text-charcoal/35 hover:text-charcoal/60",
            ].join(" ")}>{t}</button>
        ))}
      </div>

      {tab === "postings" && (
        <div className="space-y-3">
          {postings.map((job) => {
            const isOpen = expandedJob === job.id;
            const jobApplicants = applicants.filter((a) => a.jobId === job.id);
            return (
              <div key={job.id} className="rounded-2xl border border-black/6 bg-white overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`rounded-full border px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] ${job.type === "internship" ? "text-pink-700 bg-pink-50 border-pink-200" : "text-sky-700 bg-sky-50 border-sky-200"}`}>
                        {job.type === "internship" ? "Internship" : "Full-time"}
                      </span>
                      {!job.active && <span className="text-charcoal/25 text-[10px] font-sans">(Closed)</span>}
                    </div>
                    <p className="font-sans text-sm font-medium text-charcoal/80">{job.title}</p>
                    <p className="font-sans text-xs text-charcoal/35">{job.department} · {job.location} · {job.openings} opening{job.openings > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="font-serif text-xl text-charcoal">{job.applicants}</p>
                      <p className="font-sans text-[10px] text-charcoal/35">Applicants</p>
                    </div>
                    <button type="button" onClick={() => setExpandedJob(isOpen ? null : job.id)}
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      className="rounded-lg p-1.5 text-charcoal/30 hover:text-charcoal transition-colors">
                      <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-black/6 px-5 py-4 bg-black/2">
                    {jobApplicants.length === 0
                      ? <p className="text-charcoal/25 text-sm font-sans">No applicants yet.</p>
                      : (
                        <table className="w-full font-sans text-sm">
                          <thead>
                            <tr>
                              {["Name", "Background", "Status", "Applied", "Actions"].map((h) => (
                                <th key={h} className="py-2 text-left text-[10px] tracking-[0.12em] uppercase text-charcoal/25 font-medium">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5">
                            {jobApplicants.map((app) => {
                              const st = APP_STATUS_CFG[app.status];
                              const next = APP_NEXT[app.status];
                              return (
                                <tr key={app.id}>
                                  <td className="py-2.5">
                                    <p className="text-charcoal/70 font-medium">{app.name}</p>
                                    <p className="text-charcoal/30 text-xs">{app.email}</p>
                                  </td>
                                  <td className="py-2.5 text-charcoal/40 text-xs">{app.college ?? app.experience ?? "—"}</td>
                                  <td className="py-2.5">
                                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] ${st.cls}`}>{st.label}</span>
                                  </td>
                                  <td className="py-2.5 text-charcoal/30 text-xs">{new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                  <td className="py-2.5">
                                    <div className="flex gap-1.5">
                                      {next && (
                                        <button type="button" onClick={() => advance(app.id, next)}
                                          className="rounded-full bg-black/5 border border-black/10 px-2.5 py-1 text-[10px] text-charcoal/60 hover:text-charcoal hover:border-black/20 transition-colors capitalize">
                                          → {APP_STATUS_CFG[next].label}
                                        </button>
                                      )}
                                      {app.status !== "rejected" && app.status !== "offered" && (
                                        <button type="button" onClick={() => advance(app.id, "rejected")}
                                          className="rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-[10px] text-red-600 hover:bg-red-100 transition-colors">
                                          Reject
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "applicants" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/25" />
              <input type="text" placeholder="Search applicants…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="rounded-xl border border-black/10 bg-black/4 py-2.5 pl-9 pr-4 font-sans text-sm text-charcoal/80 placeholder:text-charcoal/25 focus:border-black/20 focus:outline-none transition-colors w-56" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "applied", "shortlisted", "interviewing", "offered", "rejected"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatusFilter(s)}
                  className={["rounded-full px-3.5 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors border",
                    statusFilter === s ? "bg-black/6 text-charcoal border-black/15" : "border-black/8 text-charcoal/40 hover:text-charcoal/60",
                  ].join(" ")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-black/6 overflow-hidden">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-black/2">
                  {["Applicant", "Role", "Background", "Status", "Applied", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-charcoal/25 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredApplicants.map((app) => {
                  const st   = APP_STATUS_CFG[app.status];
                  const next = APP_NEXT[app.status];
                  return (
                    <tr key={app.id} className="hover:bg-black/2 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-charcoal/80 font-medium">{app.name}</p>
                        <p className="text-charcoal/35 text-xs">{app.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-charcoal/55 text-xs max-w-[140px]">{app.role}</td>
                      <td className="px-4 py-3.5 text-charcoal/40 text-xs">{app.college ?? app.experience ?? "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-charcoal/30 text-xs">{new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          {next && (
                            <button type="button" onClick={() => advance(app.id, next)}
                              className="rounded-full bg-black/5 border border-black/10 px-2.5 py-1 text-[10px] text-charcoal/60 hover:text-charcoal hover:border-black/20 transition-colors capitalize">
                              → {APP_STATUS_CFG[next].label}
                            </button>
                          )}
                          {app.status !== "rejected" && app.status !== "offered" && (
                            <button type="button" onClick={() => advance(app.id, "rejected")}
                              className="rounded-full bg-red-50 border border-red-200 px-2.5 py-1 text-[10px] text-red-600 hover:bg-red-100 transition-colors">
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredApplicants.length === 0 && (
              <div className="py-16 text-center font-sans text-sm text-charcoal/25">No applicants found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
