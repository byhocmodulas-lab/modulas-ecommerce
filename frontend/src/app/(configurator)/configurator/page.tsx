import { ConfiguratorCanvas } from "@/components/configurator/configurator-canvas";
import { ModulePanel } from "@/components/configurator/module-panel";
import { ConfigSummary } from "@/components/configurator/config-summary";
import { ConfiguratorProvider } from "@/lib/stores/configurator-store";

export const metadata = {
  title: "Configure Your Piece",
  description: "Design your perfect modular furniture with our real-time 3D configurator.",
};

interface ConfiguratorPageProps {
  searchParams: { productId?: string; configId?: string };
}

export default function ConfiguratorPage({ searchParams }: ConfiguratorPageProps) {
  return (
    <ConfiguratorProvider
      productId={searchParams.productId}
      savedConfigId={searchParams.configId}
    >
      <div className="flex h-screen overflow-hidden">
        {/* Left: Module selection panel */}
        <ModulePanel className="w-72 shrink-0 overflow-y-auto border-r" />

        {/* Center: 3D canvas */}
        <ConfiguratorCanvas className="flex-1" />

        {/* Right: Summary + Add to cart */}
        <ConfigSummary className="w-80 shrink-0 overflow-y-auto border-l" />
      </div>
    </ConfiguratorProvider>
  );
}
