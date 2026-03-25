import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock, MapPin, Wifi, ArrowRight, Users } from "lucide-react";
import { fetchWithTimeout } from "@/lib/utils/fetch-with-timeout";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Workshops & Masterclasses — Modulas",
  description:
    "Learn furniture design, joinery, upholstery and interior styling through Modulas workshops and masterclasses at our Modulas Experience Centre, Gurgaon.",
};

interface Workshop {
  id: string;
  slug: string;
  title: string;
  type: "workshop" | "masterclass" | "course" | "internship";
  thumbnail?: string;
  excerpt?: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  price: number;
  startsAt: string;
  durationHours: number;
  isOnline: boolean;
  spotsLeft?: number;
  instructor?: string;
}

const PLACEHOLDER: Workshop[] = [
  {
    id: "ws-1", slug: "intro-to-joinery",
    title: "Introduction to Traditional Joinery",
    type: "workshop", skillLevel: "Beginner", price: 195,
    startsAt: "2026-04-12T10:00:00Z", durationHours: 6, isOnline: false,
    spotsLeft: 4, instructor: "Thomas Webb",
    thumbnail: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=700&q=80",
    excerpt: "Learn mortise & tenon, dovetail and dado joints from scratch in our fully equipped Modulas Experience Centre, Gurgaon.",
  },
  {
    id: "ws-2", slug: "upholstery-masterclass",
    title: "Upholstery Masterclass",
    type: "masterclass", skillLevel: "Intermediate", price: 350,
    startsAt: "2026-04-19T09:00:00Z", durationHours: 8, isOnline: false,
    spotsLeft: 2, instructor: "Sarah Mills",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80",
    excerpt: "A full-day deep dive into traditional spring suspension, padding and fabric finishing techniques.",
  },
  {
    id: "ws-3", slug: "furniture-design-fundamentals",
    title: "Furniture Design Fundamentals",
    type: "course", skillLevel: "Beginner", price: 0,
    startsAt: "2026-04-25T14:00:00Z", durationHours: 3, isOnline: true,
    spotsLeft: 40, instructor: "Eleanor Whitfield",
    thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=80",
    excerpt: "An introductory online course covering proportion, material selection and the design brief process.",
  },
  {
    id: "ws-4", slug: "wood-finishing-techniques",
    title: "Wood Finishing & Surface Treatments",
    type: "workshop", skillLevel: "Intermediate", price: 175,
    startsAt: "2026-05-03T10:00:00Z", durationHours: 5, isOnline: false,
    spotsLeft: 6, instructor: "Thomas Webb",
    thumbnail: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=700&q=80",
    excerpt: "Oil, wax, lacquer and paint — master every finish to protect and beautify your work.",
  },
  {
    id: "ws-5", slug: "cad-for-furniture",
    title: "CAD Modelling for Furniture Makers",
    type: "course", skillLevel: "Advanced", price: 420,
    startsAt: "2026-05-10T09:00:00Z", durationHours: 12, isOnline: true,
    spotsLeft: 12, instructor: "James Harlow",
    thumbnail: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=700&q=80",
    excerpt: "From sketch to manufacturable 3D model. Covers Fusion 360 and SketchUp with furniture-specific workflows.",
  },
  {
    id: "ws-6", slug: "summer-internship-2026",
    title: "Summer Workshop Internship 2026",
    type: "internship", skillLevel: "All Levels", price: 0,
    startsAt: "2026-06-01T09:00:00Z", durationHours: 160, isOnline: false,
    spotsLeft: 3, instructor: "Modulas Studio",
    thumbnail: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=700",
    excerpt: "Four weeks embedded in our Modulas Experience Centre, Gurgaon learning every stage of furniture production from design to delivery.",
  },
];

const TYPE_COLOUR = {
  workshop:    "text-charcoal/70 bg-black/5 border-black/10",
  masterclass: "text-gold bg-gold/10 border-gold/20",
  course:      "text-sky-700 bg-sky-50 border-sky-200",
  internship:  "text-violet-700 bg-violet-50 border-violet-200",
};

const LEVEL_COLOUR = {
  "Beginner":    "text-emerald-700 bg-emerald-50",
  "Intermediate":"text-amber-700 bg-amber-50",
  "Advanced":    "text-red-600 bg-red-50",
  "All Levels":  "text-charcoal/50 bg-black/4",
};

const FILTERS = ["All", "Workshops", "Masterclasses", "Courses", "Internships"] as const;

async function fetchWorkshops(): Promise<Workshop[]> {
  try {
    const res = await fetchWithTimeout(
      `${process.env.API_URL ?? "http://localhost:4000"}/api/v1/workshops?limit=20`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    return data.data ?? PLACEHOLDER;
  } catch {
    return PLACEHOLDER;
  }
}

function WorkshopCard({ w }: { w: Workshop }) {
  const date = new Date(w.startsAt).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "long",
  });
  const time = new Date(w.startsAt).toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  });
  const urgent = (w.spotsLeft ?? 99) <= 3;

  return (
    <Link
      href={`/workshops/${w.slug}`}
      className="group flex flex-col rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 overflow-hidden transition-shadow hover:shadow-luxury"
    >
      {/* Cover */}
      <div className="aspect-[16/9] overflow-hidden bg-cream dark:bg-charcoal-800 relative">
        {w.thumbnail ? (
          <img
            src={w.thumbnail}
            alt={w.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center opacity-10">
            <div className="grid grid-cols-5 gap-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-5 w-5 rounded bg-charcoal" />
              ))}
            </div>
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-[10px] tracking-[0.1em] uppercase font-medium ${TYPE_COLOUR[w.type]}`}>
            {w.type}
          </span>
        </div>
        {w.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 font-sans text-[10px] text-sky-600">
            <Wifi className="h-3 w-3" /> Online
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Level */}
        <span className={`inline-flex self-start rounded-full px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.08em] font-medium mb-2 ${LEVEL_COLOUR[w.skillLevel]}`}>
          {w.skillLevel}
        </span>

        <h3 className="font-serif text-lg text-charcoal dark:text-cream leading-snug group-hover:text-gold transition-colors">
          {w.title}
        </h3>
        {w.excerpt && (
          <p className="mt-2 font-sans text-sm text-charcoal/50 dark:text-cream/50 leading-relaxed line-clamp-2">
            {w.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {date} · {time}
          </div>
          <div className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {w.durationHours < 24 ? `${w.durationHours} hours` : `${Math.round(w.durationHours / 8)} days`}
          </div>
          {!w.isOnline && (
            <div className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Modulas Experience Centre, Gurgaon
            </div>
          )}
          {w.instructor && (
            <div className="flex items-center gap-1.5 font-sans text-xs text-charcoal/40">
              <Users className="h-3.5 w-3.5 shrink-0" />
              with {w.instructor}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div>
            <p className="font-serif text-xl text-charcoal dark:text-cream">
              {w.price === 0 ? "Free" : formatPrice(w.price)}
            </p>
            {w.spotsLeft !== undefined && (
              <p className={`font-sans text-[11px] ${urgent ? "text-red-500 font-medium" : "text-charcoal/35"}`}>
                {urgent ? `Only ${w.spotsLeft} spots left` : `${w.spotsLeft} spots available`}
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/30 group-hover:text-gold transition-colors">
            Book <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function WorkshopsPage() {
  const workshops = await fetchWorkshops();

  const upcomingOnline = workshops.filter((w) => w.isOnline).length;
  const totalSpots     = workshops.reduce((s, w) => s + (w.spotsLeft ?? 0), 0);
  const freeCount      = workshops.filter((w) => w.price === 0).length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-xl">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-gold mb-3">Workshops</p>
        <h1 className="font-serif text-4xl text-charcoal dark:text-cream lg:text-5xl">
          Learn the Craft
        </h1>
        <p className="mt-4 font-sans text-base text-charcoal/50 dark:text-cream/50 leading-relaxed">
          Hands-on workshops, online courses, and masterclasses in furniture design, joinery, upholstery and finishing — taught by makers, for makers.
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: workshops.length, label: "Upcoming events" },
          { value: upcomingOnline,   label: "Online courses" },
          { value: freeCount,        label: "Free sessions" },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 p-5 text-center">
            <p className="font-serif text-3xl text-charcoal dark:text-cream">{value}</p>
            <p className="font-sans text-xs text-charcoal/40 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "All" ? "/workshops" : `/workshops?type=${f.toLowerCase().slice(0, -1)}`}
            className="rounded-full border border-black/8 px-4 py-1.5 font-sans text-[11px] tracking-[0.08em] uppercase text-charcoal/50 hover:border-gold hover:text-gold transition-colors dark:border-white/8 dark:text-cream/50"
          >
            {f}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workshops.map((w) => (
          <WorkshopCard key={w.id} w={w} />
        ))}
      </div>

      {/* Private workshops CTA */}
      <div className="rounded-2xl border border-black/6 bg-white dark:bg-charcoal-900 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-gold mb-1">Private & Corporate</p>
          <h2 className="font-serif text-2xl text-charcoal dark:text-cream">
            Book a private workshop
          </h2>
          <p className="mt-1 font-sans text-sm text-charcoal/50 dark:text-cream/50 max-w-md">
            We offer bespoke workshops for teams, architectural practices, and private groups.
            Sessions from half-day to multi-day, fully tailored.
          </p>
        </div>
        <Link
          href="/contact?subject=private-workshop"
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-[11px] tracking-[0.12em] uppercase text-charcoal-950 hover:bg-gold-400 transition-colors"
        >
          Enquire <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
