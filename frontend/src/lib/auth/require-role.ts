import { redirect } from "next/navigation";

export function requireRole(userId?: string | null, _roles: string[] = []) {
  // Minimal stub: real implementation should check session/roles and possibly throw/redirect
  if (!userId) {
    // in real app we'd redirect or throw
    return;
  }
  return;
}

export default requireRole;
