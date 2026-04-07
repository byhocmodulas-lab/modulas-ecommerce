import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Free Home Visit — Modulas",
  description:
    "Book a complimentary home consultation with a Modulas designer in Gurgaon, Delhi, Mumbai, Bengaluru, and across India. We visit your space, take precise measurements, and present a bespoke design proposal — at no charge.",
  keywords: [
    "free home consultation furniture",
    "interior design consultation Gurgaon",
    "furniture consultation India",
    "modular kitchen consultation",
    "modular wardrobe consultation",
    "bespoke furniture consultation",
    "home visit interior design",
  ],
  alternates: { canonical: "https://modulas.in/book-consultation" },
  openGraph: {
    title:       "Book a Free Home Visit — Modulas",
    description: "A Modulas designer visits your home, takes precise measurements, and presents a bespoke design proposal — all complimentary.",
    url:         "https://modulas.in/book-consultation",
    images: [{ url: "https://assets.modulas.in/og/consultation.jpg", width: 1200, height: 630 }],
  },
};

export default function BookConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
