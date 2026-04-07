import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join as a Creator — Modulas Affiliate Programme",
  description:
    "Earn commissions by sharing Modulas luxury furniture with your audience. Join India's most rewarding furniture affiliate programme — curate, share, and earn on every sale you inspire.",
  keywords: [
    "furniture affiliate programme India",
    "interior design influencer programme",
    "home décor creator affiliate",
    "furniture commission India",
    "modulas creator partner",
    "interior influencer earn commission",
  ],
  alternates: { canonical: "https://modulas.in/join/creator" },
  openGraph: {
    title:       "Join as a Creator — Modulas Affiliate Programme",
    description: "Share beautiful furniture. Earn on every sale. Join the Modulas creator programme and turn your audience into income.",
    url:         "https://modulas.in/join/creator",
  },
};

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
