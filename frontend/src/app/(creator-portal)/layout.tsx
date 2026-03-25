// This route group is intentionally a pass-through.
// All creator hub pages and layout live in (creator-hub)/
// This file must exist but should not add any wrapping UI.
export default function CreatorPortalPassthrough({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
