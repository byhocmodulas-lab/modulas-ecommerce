"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ConfiguredModule {
  id: string;
  productModuleId: string;
  modelUrl: string;
  position: [number, number, number];
  label: string;
  price: number;
}

interface ConfiguratorState {
  productId: string | null;
  configId: string | null;
  modules: ConfiguredModule[];
  selectedFinish: string;
  availableFinishes: string[];
  totalPrice: number;
  isARSupported: boolean;
  // Actions
  addModule: (module: ConfiguredModule) => void;
  removeModule: (id: string) => void;
  setFinish: (finish: string) => void;
  saveConfiguration: () => Promise<string>;
  clearConfiguration: () => void;
}

// ─── Store factory ──────────────────────────────────────────────────────────

function createConfiguratorStore(
  productId?: string,
  savedConfigId?: string,
) {
  return createStore<ConfiguratorState>()(
    immer((set, get) => ({
      productId: productId ?? null,
      configId: savedConfigId ?? null,
      modules: [],
      selectedFinish: "natural-oak",
      availableFinishes: ["natural-oak", "smoked-oak", "ebony", "white-ash"],
      totalPrice: 0,
      isARSupported:
        typeof navigator !== "undefined" &&
        "xr" in navigator,

      addModule(module) {
        set((state) => {
          state.modules.push(module);
          state.totalPrice += module.price;
        });
      },

      removeModule(id) {
        set((state) => {
          const idx = state.modules.findIndex((m: ConfiguredModule) => m.id === id);
          if (idx !== -1) {
            state.totalPrice -= state.modules[idx].price;
            state.modules.splice(idx, 1);
          }
        });
      },

      setFinish(finish) {
        set((state) => {
          state.selectedFinish = finish;
        });
      },

      async saveConfiguration() {
        const { modules, selectedFinish, productId } = get();
        const res = await fetch("/api/configurator/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modules, selectedFinish, productId }),
        });
        const { configId } = await res.json();
        set((state) => { state.configId = configId; });
        return configId;
      },

      clearConfiguration() {
        set((state) => {
          state.modules = [];
          state.totalPrice = 0;
          state.configId = null;
        });
      },
    })),
  );
}

// ─── Context ────────────────────────────────────────────────────────────────

type ConfiguratorStore = ReturnType<typeof createConfiguratorStore>;
const ConfiguratorContext = createContext<ConfiguratorStore | null>(null);

export function ConfiguratorProvider({
  children,
  productId,
  savedConfigId,
}: {
  children: React.ReactNode;
  productId?: string;
  savedConfigId?: string;
}) {
  const storeRef = useRef<ConfiguratorStore>();
  if (!storeRef.current) {
    storeRef.current = createConfiguratorStore(productId, savedConfigId);
  }
  return (
    <ConfiguratorContext.Provider value={storeRef.current}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator<T = ConfiguratorState>(
  selector: (state: ConfiguratorState) => T = (s) => s as unknown as T,
) {
  const store = useContext(ConfiguratorContext);
  if (!store) throw new Error("useConfigurator must be inside ConfiguratorProvider");
  return useStore(store, selector);
}
