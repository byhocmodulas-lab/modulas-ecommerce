import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Workshop — Sign in" };

export default function WorkshopLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <>
      <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold/60 mb-10">
        Workshop &amp; Internship
      </p>

      <h1 className="font-serif text-3xl font-light text-cream mb-2">
        Learning portal.
      </h1>
      <p className="font-sans text-sm text-cream/40 mb-10">
        Sign in to access your courses, progress, and certificates.
      </p>

      <LoginForm redirectTo={searchParams.next ?? "/intern"} theme="dark" />

      <p className="mt-10 font-sans text-[11px] text-cream/25 text-center leading-relaxed">
        Looking to join?{" "}
        <a href="/join/intern" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">
          Apply for an internship
        </a>
      </p>
    </>
  );
}
