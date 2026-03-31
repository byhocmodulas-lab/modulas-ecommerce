import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Vendor Portal — Sign in" };

export default async function VendorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <>
      <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold/60 mb-10">
        Vendor Portal
      </p>

      <h1 className="font-serif text-3xl font-light text-cream mb-2">
        Seller dashboard.
      </h1>
      <p className="font-sans text-sm text-cream/40 mb-10">
        Sign in to manage your products, orders, and brand presence.
      </p>

      <LoginForm redirectTo={next ?? "/vendor"} theme="dark" />

      <p className="mt-10 font-sans text-[11px] text-cream/25 text-center leading-relaxed">
        Want to sell on Modulas?{" "}
        <a href="/join/vendor" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
          Apply to become a vendor
        </a>
      </p>
    </>
  );
}
