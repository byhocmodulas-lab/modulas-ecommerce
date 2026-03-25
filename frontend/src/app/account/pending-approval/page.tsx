import type { Metadata } from "next";
import { Clock, CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = { title: "Account pending approval — Modulas" };

const STEPS = [
  {
    icon: CheckCircle2,
    title: "Account created",
    description: "Your details have been saved securely.",
    done: true,
  },
  {
    icon: Mail,
    title: "Under review",
    description: "Our team is verifying your credentials. This usually takes 1–2 business days.",
    done: false,
  },
  {
    icon: CheckCircle2,
    title: "Full access granted",
    description: "You'll receive an email as soon as your account is approved.",
    done: false,
  },
];

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="mb-12 block text-center">
          <span className="font-serif text-xl tracking-widest text-stone-900">MODULAS</span>
        </a>

        {/* Card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-7 w-7 text-amber-500" />
            </div>
          </div>

          <h1 className="mb-2 text-center font-serif text-2xl font-light text-stone-900">
            Pending approval
          </h1>
          <p className="mb-8 text-center text-sm text-stone-500">
            Your account is awaiting verification by our team. You can browse the store
            while we review your application.
          </p>

          {/* Progress steps */}
          <ol className="space-y-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-emerald-100 text-emerald-600"
                        : i === 1
                          ? "bg-amber-100 text-amber-600"
                          : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        step.done
                          ? "text-emerald-700"
                          : i === 1
                            ? "text-amber-700"
                            : "text-stone-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-stone-400">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            className="flex flex-1 items-center justify-center rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Browse the store
          </a>
          <a
            href="/login"
            className="flex flex-1 items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Sign in to another account
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Questions?{" "}
          <a href="mailto:hello@modulas.co.uk" className="underline hover:text-stone-600">
            hello@modulas.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}