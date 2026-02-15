import { useEffect, useRef, useState } from "react";
import { MATRICES } from "../assets/matrices";
import { COULEURS } from "../assets/couleurs";

// Fonction shuffle exacte du code de référence
const shuffle = (array) => {
  let shuffled = [...array];
  let n = shuffled.length;
  let r, a;
  for (; n; ) {
    a = Math.floor(Math.random() * n--);
    r = shuffled[n];
    shuffled[n] = shuffled[a];
    shuffled[a] = r;
  }
  return shuffled;
};

export default function PixelLogo({ logo, size = 200, pixelSize = 8 }) {
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const shuffledOrderRef = useRef([]);

  const [isHovered, setIsHovered] = useState(false);
  const [activePixels, setActivePixels] = useState([]);
  const [fadeInPixels, setFadeInPixels] = useState(new Set());
  const [fadeOutPixels, setFadeOutPixels] = useState(new Set());
  const [shimmerPixels, setShimmerPixels] = useState([]);

  const matrix = MATRICES[logo];
  const colors = COULEURS[logo];

  // Collecte tous les pixels
  const allPixels = [];
  if (matrix) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x] !== 0) {
          allPixels.push({ x, y, value: matrix[y][x] });
        }
      }
    }
  }

  const rows = matrix?.length || 0;
  const cols = matrix?.[0]?.length || 0;

  // Animation automatique avec délai de 200ms - COLORIE DIRECTEMENT
  useEffect(() => {
    let shuffledOrder;
    let newActive;
    let interval;
    let timeout;

    if (!allPixels.length) return;

    let currentIndex = 0;

    if (isHovered) {
      // Shuffle l'ordre et initialise
      shuffledOrder = shuffle([...Array(allPixels.length).keys()]);
      shuffledOrderRef.current = shuffledOrder;
      newActive = Array(allPixels.length).fill(false);
      setActivePixels(newActive);
      setFadeOutPixels(new Set());

      // Délai de 200ms avant de démarrer
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          let newFadeIn = new Set();

          for (let i = 0; i < 4 && currentIndex < shuffledOrder.length; i++) {
            newActive[shuffledOrder[currentIndex]] = true;
            newFadeIn.add(shuffledOrder[currentIndex]);
            currentIndex++;
          }

          setActivePixels([...newActive]);
          setFadeInPixels(newFadeIn);

          setTimeout(() => setFadeInPixels(new Set()), 300);

          if (currentIndex >= shuffledOrder.length) {
            clearInterval(interval);
          }
        }, 10);
      }, 200);
    } else {
      // Animation de sortie (reverse)
      shuffledOrder = shuffledOrderRef.current.length
        ? shuffledOrderRef.current
        : [...Array(allPixels.length).keys()];

      currentIndex = shuffledOrder.length - 1;
      newActive = Array.from(activePixels);
      setFadeInPixels(new Set());

      // Délai de 200ms avant le fade-out
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          let newFadeOut = new Set();

          for (let i = 0; i < 4 && currentIndex >= 0; i++) {
            newActive[shuffledOrder[currentIndex]] = false;
            newFadeOut.add(shuffledOrder[currentIndex]);
            currentIndex--;
          }

          setActivePixels([...newActive]);
          setFadeOutPixels(newFadeOut);

          setTimeout(() => setFadeOutPixels(new Set()), 300);

          if (currentIndex < 0) {
            clearInterval(interval);
          }
        }, 10);
      }, 200);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isHovered, allPixels.length]);

  // Shimmer dynamique - pixels qui brillent aléatoirement
  useEffect(() => {
    if (!isHovered || allPixels.length === 0) {
      setShimmerPixels([]);
      return;
    }

    const updateShimmer = () => {
      // Compte combien de pixels sont actuellement actifs
      const activeCount = activePixels.filter(Boolean).length;

      // Calcule le nombre de pixels qui doivent briller (50% des pixels actifs, max 100)
      const shimmerCount = Math.max(
        1,
        Math.min(100, Math.round(0.5 * activeCount)),
      );

      // Sélectionne aléatoirement des pixels parmi ceux qui sont actifs
      const activeIndices = [];
      for (let i = 0; i < activePixels.length; i++) {
        if (activePixels[i]) {
          activeIndices.push(i);
        }
      }

      const shuffled = shuffle(activeIndices);
      setShimmerPixels(shuffled.slice(0, shimmerCount));
    };

    updateShimmer();
    const shimmerInterval = setInterval(updateShimmer, 500);

    return () => clearInterval(shimmerInterval);
  }, [isHovered, activePixels]);

  // Dessine le canvas - UTILISE DIRECTEMENT LES COULEURS + SHIMMER
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !matrix || !colors) return;

    const ctx = canvas.getContext("2d");
    canvas.width = cols * pixelSize;
    canvas.height = rows * pixelSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < allPixels.length; i++) {
      const { x, y, value } = allPixels[i];
      const isActive = activePixels[i];
      const isShimmering = shimmerPixels.includes(i);

      let color;
      if (!isHovered) {
        color = "#000000";
      } else if (isActive) {
        // Utilise directement la couleur du pixel selon sa valeur
        color = colors[value] || colors[1];
      } else {
        color = "#000000";
      }

      // Ne dessine pas les pixels en fade-out
      if (fadeOutPixels.has(i)) continue;

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

      // Ajoute l'effet shimmer (brillance blanche semi-transparente)
      if (isActive && isShimmering) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
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
  }, [
    allPixels,
    activePixels,
    isHovered,
    fadeOutPixels,
    shimmerPixels,
    colors,
    cols,
    rows,
    matrix,
    pixelSize,
  ]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (!matrix || !colors) {
    return <div>Logo non trouvé</div>;
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
      }}
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
