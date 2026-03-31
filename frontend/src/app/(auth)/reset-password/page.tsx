import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Set new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Choose a strong password for your Modulas account.
        </p>
      </div>

      <ResetPasswordForm token={token ?? ""} />

      <p className="mt-8 text-center text-xs text-stone-400">
        Link expired?{" "}
        <a
          href="/forgot-password"
          className="font-medium text-amber-600 hover:text-amber-700 hover:underline"
        >
          Request a new one
        </a>
      </p>
    </>
  );
}