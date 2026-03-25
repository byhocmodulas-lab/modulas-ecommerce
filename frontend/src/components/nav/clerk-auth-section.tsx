"use client";

import Link from "next/link";
import { Component, type ReactNode, lazy, Suspense } from "react";

function SignInLink() {
  return (
    <Link
      href="/login"
      className="hidden sm:inline-flex items-center gap-2 rounded-full border border-charcoal/20 dark:border-cream/20 px-4 py-1.5 font-sans text-[12px] tracking-[0.1em] uppercase transition-all hover:border-gold hover:text-gold"
    >
      Sign In
    </Link>
  );
}

class ClerkErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const ClerkWidgets = lazy(async () => {
  const { SignedIn, SignedOut, UserButton } = await import("@clerk/nextjs");
  return {
    default: function ClerkAuth() {
      return (
        <>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-1 ring-gold/30 hover:ring-gold transition-all",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInLink />
          </SignedOut>
        </>
      );
    },
  };
});

export default function ClerkAuthSection() {
  // Skip Clerk entirely if no publishable key is configured
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <SignInLink />;
  }

  return (
    <ClerkErrorBoundary fallback={<SignInLink />}>
      <Suspense fallback={<SignInLink />}>
        <ClerkWidgets />
      </Suspense>
    </ClerkErrorBoundary>
  );
}