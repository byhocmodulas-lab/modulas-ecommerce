import { Suspense } from "react";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops & Courses — Modulas",
  description:
    "Learn furniture design, craftsmanship, and interior styling through Modulas workshops and masterclasses.",
};

interface WorkshopFilters {
  type?: string;
  level?: string;
  page?: string;
}

async function WorkshopGrid({ filters }: { filters: WorkshopFilters }) {
  let workshops: Workshop[] = [];

  try {
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.level) params.set("skillLevel", filters.level);
    if (filters.page) params.set("page", filters.page);

    const res = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1"}/workshops?${params}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    workshops = data.data ?? [];
  } catch {
    workshops = PLACEHOLDER_WORKSHOPS;
  }

  if (!workshops.length) {
    return <p className="text-neutral-500">No workshops available right now. Check back soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workshops.map((w: Workshop) => (
        <WorkshopCard key={w.id} workshop={w} />
      ))}
    </div>
  );
}

const PLACEHOLDER_WORKSHOPS: Workshop[] = [
  { id: "ws-1", slug: "intro-to-joinery", title: "Introduction to Traditional Joinery", type: "workshop", thumbnail: "", skillLevel: "Beginner", price: 195, startsAt: "2026-04-12T10:00:00Z", durationHours: 6, isOnline: false },
  { id: "ws-2", slug: "upholstery-masterclass", title: "Upholstery Masterclass", type: "masterclass", thumbnail: "", skillLevel: "Intermediate", price: 350, startsAt: "2026-04-19T09:00:00Z", durationHours: 8, isOnline: false },
  { id: "ws-3", slug: "furniture-design-fundamentals", title: "Furniture Design Fundamentals", type: "course", thumbnail: "", skillLevel: "Beginner", price: 0, startsAt: "2026-04-25T14:00:00Z", durationHours: 3, isOnline: true },
  { id: "ws-4", slug: "wood-finishing-techniques", title: "Wood Finishing & Surface Treatments", type: "workshop", thumbnail: "", skillLevel: "Intermediate", price: 175, startsAt: "2026-05-03T10:00:00Z", durationHours: 5, isOnline: false },
  { id: "ws-5", slug: "cad-for-furniture", title: "CAD Modelling for Furniture Makers", type: "course", thumbnail: "", skillLevel: "Advanced", price: 420, startsAt: "2026-05-10T09:00:00Z", durationHours: 12, isOnline: true },
  { id: "ws-6", slug: "summer-internship", title: "Summer Workshop Internship 2026", type: "internship", thumbnail: "", skillLevel: "All Levels", price: 0, startsAt: "2026-06-01T09:00:00Z", durationHours: 160, isOnline: false },
];

interface Workshop {
  id: string;
  slug: string;
  title: string;
  type: string;
  thumbnail: string;
  skillLevel: string;
  price: number;
  startsAt: string;
  durationHours: number;
  isOnline: boolean;
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  return (
    <a
      href={`/workshop/courses/${workshop.slug}`}
      className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-md"
    >
      {workshop.thumbnail && (
        <div className="aspect-video overflow-hidden bg-neutral-100">
          <img
            src={workshop.thumbnail}
            alt={workshop.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="rounded bg-neutral-100 px-2 py-0.5 font-medium uppercase">
            {workshop.type}
          </span>
          <span>{workshop.skillLevel}</span>
          {workshop.isOnline && <span>Online</span>}
        </div>
        <h3 className="mt-2 text-lg font-semibold group-hover:underline">
          {workshop.title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium">
            {workshop.price === 0 ? "Free" : `£${workshop.price}`}
          </span>
          {workshop.startsAt && (
            <span className="text-neutral-500">
              {new Date(workshop.startsAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export default async function WorkshopsPage({
  searchParams,
}: {
  searchParams: Promise<WorkshopFilters>;
}) {
  const resolvedParams = await searchParams;
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Workshops & Courses</h1>
        <p className="mt-2 text-neutral-600">
          Master furniture design, craftsmanship, and interior styling.
        </p>
      </div>

      <div className="mb-6 flex gap-3">
        <FilterChip href="?type=workshop" label="Workshops" active={resolvedParams.type === "workshop"} />
        <FilterChip href="?type=course" label="Courses" active={resolvedParams.type === "course"} />
        <FilterChip href="?type=masterclass" label="Masterclasses" active={resolvedParams.type === "masterclass"} />
        <FilterChip href="?type=internship" label="Internships" active={resolvedParams.type === "internship"} />
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        }
      >
        <WorkshopGrid filters={resolvedParams} />
      </Suspense>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-300 hover:border-neutral-400"
      }`}
    >
      {label}
    </a>
  );
}
