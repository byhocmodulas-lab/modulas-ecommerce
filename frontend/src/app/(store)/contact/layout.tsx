import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact Us — Modulas | Luxury Furniture Studio, Gurgaon",
  description:
    "Get in touch with Modulas — showroom visits, bespoke enquiries, trade programme, and order support. Based in Gurgaon, serving Delhi-NCR and across India.",
  keywords: [
    "contact Modulas furniture",
    "furniture showroom Gurgaon",
    "luxury furniture enquiry India",
    "bespoke furniture contact India",
    "Modulas showroom Delhi NCR",
  ],
  alternates: { canonical: "https://modulas.in/contact" },
  openGraph: {
    title: "Contact Us — Modulas | Luxury Furniture Studio, Gurgaon",
    description: "Reach our team for showroom visits, bespoke enquiries, trade programme, and order support.",
    url: "https://modulas.in/contact",
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
