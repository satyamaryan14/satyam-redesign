import { useState, useEffect } from "react";

// Breakpoints
export const BP = {
  sm: 480,
  md: 768,
  lg: 1024,
};

// Returns { isMobile, isTablet, isDesktop, width }
export function useResponsive() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    width,
    isMobile: width < BP.md,
    isTablet: width >= BP.md && width < BP.lg,
    isDesktop: width >= BP.lg,
  };
}

// Design tokens shared across all pages
export const tokens = {
  font: "'DM Sans', 'Segoe UI', sans-serif",
  navy: "#2d3748",
  navyDark: "#1a202c",
  blue: "#2563eb",
  blueLight: "#eff6ff",
  blueBorder: "#bfdbfe",
  green: "#16a34a",
  red: "#e53e3e",
  gray50: "#f7fafc",
  gray100: "#f4f6f9",
  gray200: "#e2e8f0",
  gray400: "#cbd5e0",
  gray500: "#a0aec0",
  gray600: "#718096",
  gray700: "#4a5568",
  gray800: "#2d3748",
  gray900: "#1a202c",
  radius: { sm: 6, md: 8, lg: 12, xl: 14 },
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
};

// Shared navbar styles (responsive)
export function navbarStyles(isMobile) {
  return {
    navbar: {
      background: tokens.navy,
      borderBottom: `1px solid #3a4a5c`,
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navInner: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: isMobile ? "0 16px" : "0 24px",
      height: isMobile ? 48 : 52,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navLogo: {
      fontSize: isMobile ? 15 : 18,
      fontWeight: 700,
      color: "#ffffff",
      letterSpacing: "-0.01em",
    },
    navLinks: {
      display: "flex",
      gap: isMobile ? 12 : 24,
    },
    navLink: {
      fontSize: isMobile ? 12 : 14,
      color: "#cbd5e0",
      textDecoration: "none",
      fontWeight: 500,
    },
  };
}

// Shared input style builder
export function inputStyle(hasError = false, extra = {}) {
  return {
    width: "100%",
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#fc8181" : tokens.gray200}`,
    borderRadius: tokens.radius.md,
    fontSize: 14,
    color: tokens.gray900,
    background: hasError ? "#fff5f5" : tokens.gray50,
    fontFamily: tokens.font,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .15s, box-shadow .15s",
    ...extra,
  };
}

// Shared primary button
export function primaryBtn(extra = {}) {
  return {
    background: tokens.blue,
    color: "#fff",
    border: "none",
    borderRadius: tokens.radius.md,
    fontFamily: tokens.font,
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    transition: "background .15s, opacity .15s",
    ...extra,
  };
}