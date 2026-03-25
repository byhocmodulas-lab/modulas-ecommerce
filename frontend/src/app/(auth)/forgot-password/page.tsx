import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-light text-stone-900">
          Forgot your password?
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <ForgotPasswordForm />
    </>
  );
}