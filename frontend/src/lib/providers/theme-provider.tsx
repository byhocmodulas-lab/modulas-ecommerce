"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

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
