import { redirect } from "next/navigation";

// Moved to /configurator to avoid route conflict with the home page (app/page.tsx).
// All links to the configurator should use /configurator.
export default async function ConfiguratorRootRedirect({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; configId?: string }>;
}) {
  const { productId, configId } = await searchParams;
  const params = new URLSearchParams();
  if (productId) params.set("productId", productId);
  if (configId)  params.set("configId",  configId);
  const qs = params.toString();
  redirect(`/configurator${qs ? `?${qs}` : ""}`);
}
