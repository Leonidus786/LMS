import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch (error) {
      console.error("Error accessing localStorage for theme:", error);
      return defaultTheme; // Default to 'light' if localStorage access fails
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);

      // Set up system theme change listener
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);

      // Clean up the listener when theme changes or component unmounts
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      // Apply the selected theme directly
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (error) {
        console.error("Error setting theme in localStorage:", error);
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
