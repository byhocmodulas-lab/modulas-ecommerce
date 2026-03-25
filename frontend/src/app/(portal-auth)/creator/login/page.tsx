import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Creator Hub — Sign in" };

export default function CreatorLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <>
      <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold/60 mb-10">
        Creator Hub
      </p>

      <h1 className="font-serif text-3xl font-light text-cream mb-2">
        Your creative workspace.
      </h1>
      <p className="font-sans text-sm text-cream/40 mb-10">
        Sign in to manage your affiliate links, campaigns, and earnings.
      </p>

      <LoginForm redirectTo={searchParams.next ?? "/creator"} theme="dark" />

      <p className="mt-10 font-sans text-[11px] text-cream/25 text-center leading-relaxed">
        Interested in collaborating?{" "}
        <a href="/join/creator" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
          Apply to the Creator Hub
        </a>
      </p>
    </>
  );
}
