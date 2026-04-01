import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modulas",
  robots: { index: false, follow: false },
};

// Intentionally minimal — no header, footer, or nav.
// This route group is for internal admin access only.
export default function HiddenAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
