'use client'
import { createContext, useContext, useState } from "react";

type themeContextTypes = {
  theme: "light" | "dark" | string;
  toggleTheme: () => void;
};

const themeContextDefaultValues: themeContextTypes = {
  theme: "dark",
  toggleTheme: () => {},
};

const ThemeContext = createContext<themeContextTypes>(
  themeContextDefaultValues
);

export function useTheme() {
  return useContext(ThemeContext);
}

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<"light" | "dark" | string>("dark");
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </>
  );
}
