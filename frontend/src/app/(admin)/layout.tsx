import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  BarChart3,
  Cpu,
  Globe,
  Search,
  Rss,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/catalog",    label: "Catalog",      icon: Package },
  { href: "/admin/orders",     label: "Orders",       icon: ShoppingBag },
  { href: "/admin/users",      label: "Users",        icon: Users },
  { href: "/admin/vendors",    label: "Vendors",      icon: Store },
  { href: "/admin/intel",      label: "Intel",        icon: BarChart3 },
  { href: "/admin/social",     label: "Social",       icon: Rss },
  { href: "/admin/seo",        label: "SEO / AEO",   icon: Globe },
  { href: "/admin/ai-studio",  label: "AI Studio",    icon: Cpu },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side role guard — redirects to / if not admin/editor
  await requireRole("master_admin", "editor");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-60 flex-shrink-0 overflow-y-auto bg-stone-950">
        {/* Brand */}
        <div className="border-b border-stone-800 px-4 py-5">
          <a href="/" className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-white">Modulas</span>
            <span className="rounded bg-amber-500 px-1.5 py-0.5 text-xs font-sans font-bold uppercase tracking-wider text-stone-950">
              Admin
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800 hover:text-white"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-800 p-4">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-stone-400 transition-colors hover:text-white"
          >
            <Search className="h-3.5 w-3.5" />
            View Store
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-y-auto bg-charcoal-50">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center border-b border-charcoal-200 bg-white px-6">
          <h1 className="text-sm font-medium text-charcoal-600">
            Administration Console
          </h1>
        </header>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}