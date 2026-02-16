import { useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ onThemeChange }) {
  const [isDark, setIsDark] = useState(true);

  const handleToggle = () => {
    setIsDark(!isDark);
    onThemeChange(!isDark);
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}`,
        backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        boxShadow: isDark
          ? "0 4px 12px rgba(0, 0, 0, 0.3)"
          : "0 4px 12px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {isDark ? (
        <Sun size={28} color="#ffffff" strokeWidth={2} />
      ) : (
        <Moon size={28} color="#000000" strokeWidth={2} />
      )}
    </button>
  );
}
