import { redirect } from "next/navigation";

// /journal → /blog (canonical URL)
export default function JournalRedirectPage() {
  redirect("/blog");
}
