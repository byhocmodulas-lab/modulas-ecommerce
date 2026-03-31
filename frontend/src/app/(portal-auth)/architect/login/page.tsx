import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Architect Portal — Sign in" };

export default async function ArchitectLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <>
      {/* Role badge */}
      <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold/60 mb-10">
        Architect &amp; Designer Portal
      </p>

      <h1 className="font-serif text-3xl font-light text-cream mb-2">
        Welcome back.
      </h1>
      <p className="font-sans text-sm text-cream/40 mb-10">
        Sign in to access your projects, quotes, and client workspace.
      </p>

      <LoginForm redirectTo={next ?? "/architect"} theme="dark" />

      <p className="mt-10 font-sans text-[11px] text-cream/25 text-center leading-relaxed">
        Not yet a partner?{" "}
        <a href="/join/architect" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
          Apply for trade access
        </a>
      </p>
    </>
  );
}
