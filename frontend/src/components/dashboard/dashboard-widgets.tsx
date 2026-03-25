"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/format";
import { formatPrice } from "@/lib/utils/format";
import type { OrderStatus } from "@/types/order";

/* ── Stat Card ────────────────────────────────────────────────── */
export interface StatCardProps {
  label: string;
  value: string | number;
  /** e.g. "+12.5%" */
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  subtext?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendDirection = "neutral",
  icon,
  subtext,
  href,
  className,
}: StatCardProps) {
  const trendColour = {
    up:      "text-emerald-600 dark:text-emerald-400",
    down:    "text-red-500 dark:text-red-400",
    neutral: "text-charcoal/40 dark:text-cream/40",
  }[trendDirection];

  const card = (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-black/6 dark:border-white/6",
        "bg-white dark:bg-charcoal-900 p-6",
        "transition-all duration-200",
        href && "hover:border-gold/30 hover:shadow-luxury cursor-pointer",
        className,
      )}
    >
      {/* Icon + label row */}
      <div className="flex items-start justify-between">
        <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/45 dark:text-cream/45">
          {label}
        </p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/8 dark:bg-gold/12 text-gold">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="font-serif text-display-md text-charcoal dark:text-cream leading-none">
        {value}
      </p>

      {/* Trend + subtext */}
      <div className="flex items-center gap-2.5">
        {trend && (
          <span className={cn("flex items-center gap-1 font-sans text-[12px] font-medium", trendColour)}>
            {trendDirection === "up" ? <TrendUpIcon /> : trendDirection === "down" ? <TrendDownIcon /> : null}
            {trend}
          </span>
        )}
        {subtext && (
          <span className="font-sans text-[11px] text-charcoal/35 dark:text-cream/35">
            {subtext}
          </span>
        )}
      </div>

      {/* Hover accent bar */}
      {href && (
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );

  return href ? <Link href={href} className="block">{card}</Link> : card;
}

/* ── Stats grid ───────────────────────────────────────────────── */
interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const colClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-4", colClass, className)}>
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

/* ── Recent Orders Widget ─────────────────────────────────────── */
export interface RecentOrderRow {
  id: string;
  customerName: string;
  productName: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

interface RecentOrdersWidgetProps {
  orders: RecentOrderRow[];
  viewAllHref?: string;
  className?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; colour: string }> = {
  pending:       { label: "Pending",       colour: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  confirmed:     { label: "Confirmed",     colour: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  in_production: { label: "In Production", colour: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  shipped:       { label: "Shipped",       colour: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  delivered:     { label: "Delivered",     colour: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  cancelled:     { label: "Cancelled",     colour: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  refunded:      { label: "Refunded",      colour: "bg-charcoal/8 text-charcoal/50 dark:bg-cream/8 dark:text-cream/50" },
};

export function RecentOrdersWidget({ orders, viewAllHref = "/admin/orders", className }: RecentOrdersWidgetProps) {
  return (
    <div className={cn("rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/6 dark:border-white/6">
        <h3 className="font-serif text-lg text-charcoal dark:text-cream">Recent Orders</h3>
        <Link href={viewAllHref} className="font-sans text-[11px] tracking-[0.1em] uppercase text-gold hover:text-gold-400 transition-colors">
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-charcoal/30 dark:text-cream/30">
            <InboxIcon />
            <p className="mt-3 font-sans text-sm">No orders yet</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/4 dark:border-white/4">
                {["Order", "Customer", "Product", "Status", "Amount"].map((h) => (
                  <th key={h} className="px-6 py-3 font-sans text-[10px] tracking-[0.2em] uppercase text-charcoal/35 dark:text-cream/35 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4 dark:divide-white/4">
              {orders.map((order) => {
                const { label, colour } = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="group hover:bg-cream-50/50 dark:hover:bg-charcoal-800/50 transition-colors">
                    <td className="px-6 py-3.5 font-sans text-[12px] text-charcoal/60 dark:text-cream/60 whitespace-nowrap">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-3.5 font-sans text-[13px] text-charcoal dark:text-cream whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-3.5 font-sans text-[13px] text-charcoal/70 dark:text-cream/70 max-w-[180px] truncate">
                      {order.productName}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[10px] tracking-[0.08em]", colour)}>
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-sans text-[13px] font-medium text-charcoal dark:text-cream whitespace-nowrap">
                      {formatPrice(order.amount, order.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── Quick Actions Widget ─────────────────────────────────────── */
export interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  colour?: "gold" | "charcoal" | "cream";
}

interface QuickActionsWidgetProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
}

export function QuickActionsWidget({
  actions,
  title = "Quick Actions",
  className,
}: QuickActionsWidgetProps) {
  return (
    <div className={cn("rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-6", className)}>
      <h3 className="font-serif text-lg text-charcoal dark:text-cream mb-5">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "group flex flex-col gap-2.5 rounded-xl border p-4 transition-all duration-200",
              "border-black/6 dark:border-white/6 hover:border-gold/30 hover:shadow-luxury",
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/8 dark:bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-charcoal-950">
              {action.icon}
            </span>
            <span>
              <span className="block font-sans text-[13px] font-medium text-charcoal dark:text-cream group-hover:text-gold transition-colors">
                {action.label}
              </span>
              <span className="block font-sans text-[11px] text-charcoal/40 dark:text-cream/40 leading-snug mt-0.5">
                {action.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Revenue Sparkline Widget ─────────────────────────────────── */
export interface RevenueDataPoint {
  label: string;
  value: number;
}

interface RevenueWidgetProps {
  data: RevenueDataPoint[];
  total: number;
  currency?: string;
  period?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  className?: string;
}

export function RevenueWidget({
  data,
  total,
  currency = "GBP",
  period = "This month",
  trend,
  trendDirection = "up",
  className,
}: RevenueWidgetProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-sans text-[11px] tracking-[0.15em] uppercase text-charcoal/40 dark:text-cream/40 mb-1">
            Revenue · {period}
          </p>
          <p className="font-serif text-display-md text-charcoal dark:text-cream leading-none">
            {formatPrice(total, currency)}
          </p>
          {trend && (
            <span className={cn("mt-1 flex items-center gap-1 font-sans text-[12px]", trendDirection === "up" ? "text-emerald-600" : "text-red-500")}>
              {trendDirection === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
              {trend} vs last period
            </span>
          )}
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/8 text-gold">
          <RevenueIcon />
        </span>
      </div>

      {/* Sparkline bar chart */}
      <div className="flex items-end gap-1 h-16" aria-label="Revenue chart" role="img">
        {data.map((point) => {
          const heightPct = (point.value / max) * 100;
          return (
            <div key={point.label} className="group relative flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-gold/20 group-hover:bg-gold transition-colors duration-200"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              />
              <span className="font-sans text-[9px] text-charcoal/30 dark:text-cream/30 truncate">
                {point.label}
              </span>
              {/* Tooltip */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <span className="whitespace-nowrap rounded bg-charcoal-950 px-2 py-0.5 font-sans text-[9px] text-cream">
                  {formatPrice(point.value, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Notification / Activity feed widget ─────────────────────── */
export interface ActivityItem {
  id: string;
  type: "order" | "review" | "enquiry" | "affiliate" | "system";
  message: string;
  time: string;
  read?: boolean;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

const ACTIVITY_ICONS: Record<ActivityItem["type"], React.ReactNode> = {
  order:     <OrderIcon />,
  review:    <ReviewIcon />,
  enquiry:   <EnquiryIcon />,
  affiliate: <AffiliateIcon />,
  system:    <SystemIcon />,
};

export function ActivityFeedWidget({ items, className }: ActivityFeedProps) {
  return (
    <div className={cn("rounded-2xl border border-black/6 dark:border-white/6 bg-white dark:bg-charcoal-900 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-black/6 dark:border-white/6">
        <h3 className="font-serif text-lg text-charcoal dark:text-cream">Activity</h3>
      </div>
      <ul className="divide-y divide-black/4 dark:divide-white/4 max-h-72 overflow-y-auto">
        {items.length === 0 ? (
          <li className="flex items-center justify-center py-10 text-charcoal/30 dark:text-cream/30 font-sans text-sm">
            No recent activity
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className={cn(
                "flex items-start gap-3.5 px-6 py-3.5 transition-colors",
                !item.read && "bg-gold/3 dark:bg-gold/5",
              )}
            >
              <span className={cn(
                "mt-0.5 shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-gold",
                "bg-gold/8 dark:bg-gold/12",
              )}>
                {ACTIVITY_ICONS[item.type]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[13px] text-charcoal dark:text-cream leading-snug">
                  {item.message}
                </p>
                <p className="font-sans text-[11px] text-charcoal/35 dark:text-cream/35 mt-0.5">
                  {item.time}
                </p>
              </div>
              {!item.read && (
                <span className="mt-1.5 shrink-0 h-2 w-2 rounded-full bg-gold" aria-label="Unread" />
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────── */
function TrendUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
function TrendDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
function RevenueIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function OrderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function ReviewIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function EnquiryIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function AffiliateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function SystemIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  );
}
