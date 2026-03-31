import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { DevLoginPanel } from "@/components/auth/dev-login-panel";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string; reset?: string }>;
}) {
  const { next, registered, reset } = await searchParams;
  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">Welcome back</h1>
        <p className="mt-2 text-sm text-stone-500">
          Sign in to your Modulas account.
        </p>
      </div>

      {registered && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Account created! Sign in to continue.
        </div>
      )}

      {reset && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Password reset successfully. Sign in with your new password.
        </div>
      )}

      <LoginForm redirectTo={next} />

      <p className="mt-8 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-amber-600 hover:text-amber-700 hover:underline">
          Create one
        </a>
      </p>

      <DevLoginPanel />
    </>
  );
}
