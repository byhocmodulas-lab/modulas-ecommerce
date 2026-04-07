import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Vendor — Sell on Modulas",
  description:
    "Partner with Modulas as a supplier or brand. List your furniture, hardware, materials, or home décor products on India's premium luxury furniture platform. Apply to join the Modulas vendor network.",
  keywords: [
    "sell furniture online India",
    "furniture vendor platform India",
    "luxury furniture supplier India",
    "become a furniture vendor",
    "modulas vendor partner",
    "furniture brand partner India",
  ],
  alternates: { canonical: "https://modulas.in/join/vendor" },
  openGraph: {
    title:       "Become a Vendor — Sell on Modulas",
    description: "Partner with Modulas and reach India's most discerning furniture buyers. Apply to list your products on our luxury platform.",
    url:         "https://modulas.in/join/vendor",
  },
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
