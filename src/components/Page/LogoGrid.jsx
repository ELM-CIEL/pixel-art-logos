import { useEffect, useRef, useState } from "react";
import PixelLogo from "../PixelLogo";

export default function LogoGrid({ isDark }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const logos = [
    "react",
    "nextjs",
    "javascript",
    "tailwind",
    "nodejs",
    "python",
    "mysql",
    "mongodb",
  ];

  // Détecte si mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Intersection Observer pour détecter le scroll (mobile seulement)
  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.3, // Animation démarre quand 30% de la section est visible
        rootMargin: "0px",
      },
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isMobile]);

  return (
    <div
      ref={sectionRef}
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDark ? "#000000" : "#ffffff",
        padding: "48px 16px",
        transition: "background-color 0.3s ease",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "48px",
          color: isDark ? "#ffffff" : "#000000",
          transition: "color 0.3s ease",
        }}
      >
        Logos
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: "0",
          maxWidth: "1000px",
          width: "100%",
        }}
      >
        {logos.map((logo, index) => (
          <div
            key={logo}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "16px" : "32px",
              borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderLeft: (isMobile ? index % 2 === 0 : index % 4 === 0)
                ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
                : "none",
              borderRight: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderBottom: (isMobile ? index >= 2 : index >= 4)
                ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
                : "none",
              transition: "border-color 0.3s ease",
            }}
          >
            <PixelLogo
              logo={logo}
              size={isMobile ? 80 : 120}
              pixelSize={isMobile ? 4 : 6}
              isDark={isDark}
              isMobile={isMobile}
              forceHover={isMobile && isInView}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
