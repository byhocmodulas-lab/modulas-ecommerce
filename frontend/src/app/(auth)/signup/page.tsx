import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">
          Join Modulas
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Create your account to explore, configure, and collaborate.
        </p>
      </div>

      <SignupForm defaultRole={searchParams.role} />

      <p className="mt-8 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-amber-600 hover:text-amber-700 hover:underline">
          Sign in
        </a>
      </p>
    </>
  );
}
