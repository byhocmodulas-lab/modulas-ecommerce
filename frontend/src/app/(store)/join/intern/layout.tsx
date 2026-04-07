import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshop & Internship — Modulas Studio",
  description:
    "Apply for a design internship or workshop placement at Modulas. Learn furniture design, interior craft, and product development from India's leading bespoke furniture studio. Open to students and recent graduates.",
  keywords: [
    "furniture design internship India",
    "interior design internship Gurgaon",
    "furniture workshop India",
    "design internship luxury brand",
    "modulas internship",
    "furniture craft workshop",
  ],
  alternates: { canonical: "https://modulas.in/join/intern" },
  openGraph: {
    title:       "Workshop & Internship — Modulas Studio",
    description: "Learn furniture design and interior craft at the Modulas studio. Apply for our internship programme and workshop placement.",
    url:         "https://modulas.in/join/intern",
  },
};

export default function InternLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
