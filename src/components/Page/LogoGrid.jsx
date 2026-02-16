import PixelLogo from "../PixelLogo";

export default function LogoGrid({ isDark }) {
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

  return (
    <div
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
          gridTemplateColumns: "repeat(4, 1fr)",
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
              padding: "32px",
              borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderLeft:
                index % 4 === 0
                  ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
                  : "none",
              borderRight: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
              borderBottom:
                index >= 4
                  ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
                  : "none",
              transition: "border-color 0.3s ease",
            }}
          >
            <PixelLogo logo={logo} size={120} pixelSize={6} />
          </div>
        ))}
      </div>
    </div>
  );
}
