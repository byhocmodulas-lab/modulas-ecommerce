import { redirect } from "next/navigation";

// Moved to /configurator to avoid route conflict with the home page (app/page.tsx).
// All links to the configurator should use /configurator.
export default function ConfiguratorRootRedirect({
  searchParams,
}: {
  searchParams: { productId?: string; configId?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.productId) params.set("productId", searchParams.productId);
  if (searchParams.configId)  params.set("configId",  searchParams.configId);
  const qs = params.toString();
  redirect(`/configurator${qs ? `?${qs}` : ""}`);
}
