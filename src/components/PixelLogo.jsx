import { useEffect, useRef, useState } from "react";
import { MATRICES } from "../assets/matrices";
import { COULEURS } from "../assets/couleurs";

export default function PixelLogo({ logo, size = 200, pixelSize = 8 }) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coloredPixels, setColoredPixels] = useState(new Set());

  const matrix = MATRICES[logo];
  const colors = COULEURS[logo];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix || !colors) return;

    const ctx = canvas.getContext("2d");
    const rows = matrix.length;
    const cols = matrix[0].length;

    canvas.width = cols * pixelSize;
    canvas.height = rows * pixelSize;

    // Efface tout
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessine tous les pixels EN NOIR - BLANC selon hover
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const value = matrix[y][x];
        if (value !== 0) {
          const pixelKey = `${x}-${y}`;
          const isColored = coloredPixels.has(pixelKey);

          // Couleur : si passage de la souris, on colore en blanc, sinon en noir
          let color;
          if (isColored) {
            color = colors[value] || colors[1];
          } else if (isHovered) {
            color = "#ffffff";
          } else {
            color = "#000000";
          }

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(
            x * pixelSize + pixelSize / 2,
            y * pixelSize + pixelSize / 2,
            pixelSize / 2 - 0.5,
            0,
            2 * Math.PI,
          );
          ctx.fill();
        }
      }
    }
  }, [logo, pixelSize, matrix, colors, isHovered, coloredPixels]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * matrix[0].length;
    const mouseY = ((e.clientY - rect.top) / rect.height) * matrix.length;

    const pixelX = Math.floor(mouseX);
    const pixelY = Math.floor(mouseY);

    if (
      pixelX >= 0 &&
      pixelX < matrix[0].length &&
      pixelY >= 0 &&
      pixelY < matrix.length &&
      matrix[pixelY][pixelX] !== 0
    ) {
      const pixelKey = `${pixelX}-${pixelY}`;

      if (!coloredPixels.has(pixelKey)) {
        setColoredPixels((prev) => new Set([...prev, pixelKey]));
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setColoredPixels(new Set()); // Réinitialise les couleurs
  };

  if (!matrix || !colors) {
    return <div className="text-red-500">Logo non trouvé : {logo}</div>;
  }

  return (
    <div
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
