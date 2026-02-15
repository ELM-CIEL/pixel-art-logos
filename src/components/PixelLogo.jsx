import { useEffect, useRef, useState } from "react";
import { MATRICES } from "../assets/matrices";
import { COULEURS } from "../assets/couleurs";

export default function PixelLogo({ logo, size = 200, pixelSize = 8 }) {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

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
          ctx.fillStyle = isHovered ? "#FFFFFF" : "#000000";
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
  }, [logo, pixelSize, matrix, colors, isHovered]);

  if (!matrix || !colors) {
    return <div className="text-red-500">Logo non trouvé : {logo}</div>;
  }

  return (
    <div
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
