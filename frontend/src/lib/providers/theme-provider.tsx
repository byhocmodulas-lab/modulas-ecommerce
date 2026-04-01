"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const CMS_API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

/** Fetch saved brand colors from CMS and apply them as CSS custom properties */
function loadBrandTheme() {
  fetch(`${CMS_API}/cms/pages/theme-settings/published`, { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data: { colors?: Record<string, string> } | null) => {
      if (!data?.colors) return;
      const root = document.documentElement;
      const c = data.colors;
      if (c.gold)       root.style.setProperty("--color-gold",      c.gold);
      if (c.charcoal)   root.style.setProperty("--color-charcoal",  c.charcoal);
      if (c.cream)      root.style.setProperty("--color-cream",      c.cream);
      if (c.background) root.style.setProperty("--surface-primary",  c.background);
      if (c.text)       root.style.setProperty("--text-primary",     c.text);
    })
    .catch(() => { /* keep CSS defaults on error */ });
}

interface ThemeContextValue {
  theme:     Theme;
  setTheme:  (t: Theme) => void;
  resolved:  "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    "system",
  setTheme: () => {},
  resolved: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setThemeState(stored);
    // Apply saved brand color customizations from CMS
    loadBrandTheme();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function apply(t: Theme) {
      const isDark = t === "dark" || (t === "system" && mediaQuery.matches);
      root.classList.toggle("dark", isDark);
      setResolved(isDark ? "dark" : "light");
    }

    apply(theme);

    const listener = () => { if (theme === "system") apply("system"); };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  function setTheme(t: Theme) {
    localStorage.setItem("theme", t);
    setThemeState(t);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}
