import { useEffect, useRef, useState, useMemo } from "react";
import { MATRICES } from "../assets/matrices";
import { COULEURS } from "../assets/couleurs";

// Fonction shuffle
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
  const shuffledOrderRef = useRef([]);

  const [isHovered, setIsHovered] = useState(false);
  const [activePixels, setActivePixels] = useState([]);
  const [fadeInPixels, setFadeInPixels] = useState(new Set());
  const [fadeOutPixels, setFadeOutPixels] = useState(new Set());
  const [shimmerPixels, setShimmerPixels] = useState([]);
  const [grayShades, setGrayShades] = useState([]);

  const matrix = MATRICES[logo];
  const colors = COULEURS[logo];

  // Détecte si le logo est principalement blanc
  const isWhiteLogo = useMemo(() => {
    if (!colors) return false;
    const mainColor = colors[1] || "";
    return (
      mainColor.toLowerCase() === "#ffffff" ||
      mainColor.toLowerCase() === "#fff" ||
      mainColor === "#FFFFFF"
    );
  }, [colors]);

  // Collecte tous les pixels
  const allPixels = useMemo(() => {
    const pixels = [];
    if (matrix) {
      for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
          if (matrix[y][x] !== 0) {
            pixels.push({ x, y, value: matrix[y][x] });
          }
        }
      }
    }
    return pixels;
  }, [matrix]);

  // Calcule la vitesse d'animation pour une durée constante
  const animationConfig = useMemo(() => {
    const totalPixels = allPixels.length;
    if (totalPixels === 0) return { pixelsPerFrame: 8, intervalMs: 5 };

    // Durée cible : 500ms pour tous les logos (2x plus rapide)
    const targetDuration = 250; // ms
    const intervalMs = 5; // intervalle fixe
    const totalFrames = targetDuration / intervalMs;
    const pixelsPerFrame = Math.max(1, Math.ceil(totalPixels / totalFrames));

    return { pixelsPerFrame, intervalMs };
  }, [allPixels.length]);

  const rows = matrix?.length || 0;
  const cols = matrix?.[0]?.length || 0;

  // Animation automatique avec vitesse normalisée
  useEffect(() => {
    if (!allPixels.length) return;

    let shuffledOrder;
    let newActive;
    let interval;
    let timeout;
    let currentIndex = 0;

    const { pixelsPerFrame, intervalMs } = animationConfig;

    if (isHovered) {
      // Shuffle l'ordre et initialise
      shuffledOrder = shuffle([...Array(allPixels.length).keys()]);
      shuffledOrderRef.current = shuffledOrder;
      newActive = Array(allPixels.length).fill(false);
      setActivePixels(newActive);
      setFadeOutPixels(new Set());

      // Délai réduit à 50ms
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          const newFadeIn = new Set();

          // Nombre de pixels adapté à la taille du logo
          for (
            let i = 0;
            i < pixelsPerFrame && currentIndex < shuffledOrder.length;
            i++
          ) {
            newActive[shuffledOrder[currentIndex]] = true;
            newFadeIn.add(shuffledOrder[currentIndex]);
            currentIndex++;
          }

          setActivePixels([...newActive]);
          setFadeInPixels(newFadeIn);

          setTimeout(() => setFadeInPixels(new Set()), 150);

          if (currentIndex >= shuffledOrder.length) {
            clearInterval(interval);
          }
        }, intervalMs);
      }, 50);
    } else {
      // Animation de sortie (reverse)
      const hasActivePixels = activePixels.some(Boolean);

      if (!hasActivePixels) return;

      shuffledOrder = shuffledOrderRef.current.length
        ? shuffledOrderRef.current
        : [...Array(allPixels.length).keys()];

      currentIndex = shuffledOrder.length - 1;
      newActive = Array.from(activePixels);
      setFadeInPixels(new Set());

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          const newFadeOut = new Set();

          // Même nombre de pixels pour la sortie
          for (let i = 0; i < pixelsPerFrame && currentIndex >= 0; i++) {
            newActive[shuffledOrder[currentIndex]] = false;
            newFadeOut.add(shuffledOrder[currentIndex]);
            currentIndex--;
          }

          setActivePixels([...newActive]);
          setFadeOutPixels(newFadeOut);

          setTimeout(() => setFadeOutPixels(new Set()), 150);

          if (currentIndex < 0) {
            clearInterval(interval);
          }
        }, intervalMs);
      }, 50);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isHovered, allPixels, animationConfig]);

  // Génération de nuances de gris pour logos blancs
  useEffect(() => {
    if (!isWhiteLogo || !isHovered || allPixels.length === 0) {
      setGrayShades([]);
      return;
    }

    const updateGrayShades = () => {
      // Génère des nuances de gris aléatoires pour chaque pixel actif
      const shades = allPixels.map(() => {
        // Nuances entre #d0d0d0 (gris clair) et #ffffff (blanc)
        const grayValue = 208 + Math.floor(Math.random() * 47); // 208 à 255
        const hex = grayValue.toString(16).padStart(2, "0");
        return `#${hex}${hex}${hex}`;
      });
      setGrayShades(shades);
    };

    updateGrayShades();
    // Change les nuances toutes les 400ms
    const grayInterval = setInterval(updateGrayShades, 400);

    return () => clearInterval(grayInterval);
  }, [isWhiteLogo, isHovered, allPixels.length]);

  // Shimmer AMÉLIORÉ
  useEffect(() => {
    if (!isHovered || allPixels.length === 0) {
      setShimmerPixels([]);
      return;
    }

    const updateShimmer = () => {
      const activeCount = activePixels.filter(Boolean).length;

      if (activeCount === 0) return;

      const shimmerPercent = 0.3 + Math.random() * 0.4;
      const shimmerCount = Math.max(
        1,
        Math.min(100, Math.round(shimmerPercent * activeCount)),
      );

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
    const shimmerInterval = setInterval(updateShimmer, 300);

    return () => clearInterval(shimmerInterval);
  }, [isHovered, activePixels, allPixels.length]);

  // Dessine le canvas avec nuances de gris et shimmer
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
      const isFadingOut = fadeOutPixels.has(i);

      let color;

      if (isActive && !isFadingOut) {
        if (isWhiteLogo) {
          // Pour les logos blancs : nuance de gris aléatoire
          color = grayShades[i] || "#e0e0e0";
        } else {
          color = colors[value] || colors[1];
        }
      } else {
        // État par défaut : gris très clair
        color = "#f0f0f0";
      }

      // Dessine le pixel principal
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

      // Contour subtil pour logos blancs
      if (isWhiteLogo && isActive && !isFadingOut) {
        ctx.strokeStyle = "#b0b0b0";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(
          x * pixelSize + pixelSize / 2,
          y * pixelSize + pixelSize / 2,
          pixelSize / 2 - 0.5,
          0,
          2 * Math.PI,
        );
        ctx.stroke();
      }

      // Shimmer
      if (isActive && isShimmering && !isFadingOut) {
        if (isWhiteLogo) {
          // Shimmer blanc pour logos blancs
          const shimmerOpacity = 0.5 + (i % 4) * 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`;
        } else {
          // Shimmer blanc classique pour autres logos
          const shimmerOpacity = 0.3 + (i % 5) * 0.1;
          ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`;
        }

        const shimmerSize = (pixelSize / 2 - 0.5) * (0.9 + (i % 3) * 0.1);

        ctx.beginPath();
        ctx.arc(
          x * pixelSize + pixelSize / 2,
          y * pixelSize + pixelSize / 2,
          shimmerSize,
          0,
          2 * Math.PI,
        );
        ctx.fill();
      }
    }
  }, [
    allPixels,
    activePixels,
    fadeOutPixels,
    shimmerPixels,
    colors,
    cols,
    rows,
    matrix,
    pixelSize,
    isWhiteLogo,
    grayShades,
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
