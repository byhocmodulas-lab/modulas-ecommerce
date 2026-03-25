import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — Modulas",
    default: "Sign in — Modulas",
  },
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between bg-stone-950 p-12 relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20 auth-panel-gradient" />

        {/* Logo */}
        <a href="/" className="relative z-10">
          <span className="font-serif text-2xl font-light tracking-widest text-white">
            MODULAS
          </span>
        </a>

        {/* Quote */}
        <div className="relative z-10 max-w-md">
          <blockquote className="font-serif text-3xl font-light leading-relaxed text-white/90">
            "Every room deserves furniture that thinks as beautifully as it looks."
          </blockquote>
          <p className="mt-6 text-sm text-amber-400/80 tracking-wider uppercase">
            Bespoke Furniture. Elevated Interiors.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-12">
          {[
            { value: "850+", label: "Projects Done" },
            { value: "98%",  label: "Client Satisfaction" },
            { value: "4.9",  label: "Client Rating" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-2xl text-white">{value}</p>
              <p className="mt-0.5 text-xs text-stone-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-stone-50 px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <a href="/" className="mb-10 lg:hidden">
          <span className="font-serif text-xl tracking-widest text-stone-900">MODULAS</span>
        </a>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
