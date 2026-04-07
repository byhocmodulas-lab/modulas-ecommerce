import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AnalyticsProvider } from "@/lib/providers/analytics-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";
import "@/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modulas.in"),
  title: {
    default: "Modulas — Bespoke Furniture. Elevated Interiors.",
    template: "%s | Modulas",
  },
  description:
    "A contemporary luxury furniture studio redefining the way interiors are experienced. Bespoke modular kitchens, wardrobes, living & bedroom furniture — designed and crafted in India.",
  openGraph: {
    type:     "website",
    locale:   "en_IN",
    url:      "https://modulas.in",
    siteName: "Modulas",
    images: [{ url: "https://assets.modulas.in/og/homepage.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@modulas_in" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            <AnalyticsProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-amber-500 focus:px-5 focus:py-2 focus:text-sm focus:text-stone-950"
              >
                Skip to content
              </a>
              <AuthProvider>
                {children}
              </AuthProvider>
              <Toaster />
            </AnalyticsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
