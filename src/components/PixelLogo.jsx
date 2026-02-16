import { useEffect, useRef, useState, useMemo } from "react";
import { MATRICES } from "../assets/matrices";
import { COULEURS } from "../assets/couleurs";

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

export default function PixelLogo({
  logo,
  size = 200,
  pixelSize = 8,
  isDark = true,
  isMobile = false,
  forceHover = false,
}) {
  const canvasRef = useRef(null);
  const shuffledOrderRef = useRef([]);
  // Ajout d'une ref pour l'état actif afin de garantir la synchronisation lors des changements rapides
  const activePixelsRef = useRef([]);

  const [isHovered, setIsHovered] = useState(false);
  const [activePixels, setActivePixels] = useState([]);
  const [fadeInPixels, setFadeInPixels] = useState(new Set());
  const [fadeOutPixels, setFadeOutPixels] = useState(new Set());
  const [shimmerPixels, setShimmerPixels] = useState([]);
  const [grayShades, setGrayShades] = useState([]);

  const matrix = MATRICES[logo];
  const colors = COULEURS[logo];

  const isWhiteLogo = useMemo(() => {
    if (!colors) return false;
    const mainColor = colors[1] || "";
    const c = mainColor.toLowerCase();
    return c === "#ffffff" || c === "#fff" || mainColor === "#FFFFFF";
  }, [colors]);

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

  const animationConfig = useMemo(() => {
    return { pixelsPerFrame: 4, intervalMs: 10 };
  }, []);

  const rows = matrix?.length || 0;
  const cols = matrix?.[0]?.length || 0;

  useEffect(() => {
    if (isMobile) setIsHovered(forceHover);
  }, [forceHover, isMobile]);

  // RESET CRITIQUE : Vide l'état quand le logo change pour éviter le bug de persistance
  useEffect(() => {
    const empty = Array(allPixels.length).fill(false);
    activePixelsRef.current = empty;
    setActivePixels(empty);
    setShimmerPixels([]);
    setGrayShades([]);
  }, [logo, allPixels.length]);

  useEffect(() => {
    if (!allPixels.length) return;

    let shuffledOrder;
    let newActive;
    let interval;
    let timeout;
    let currentIndex = 0;

    const { pixelsPerFrame, intervalMs } = animationConfig;

    if (isHovered) {
      shuffledOrder = shuffle([...Array(allPixels.length).keys()]);
      shuffledOrderRef.current = shuffledOrder;
      newActive = Array(allPixels.length).fill(false);
      setActivePixels(newActive);
      activePixelsRef.current = newActive;
      setFadeOutPixels(new Set());

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          const newFadeIn = new Set();
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
          activePixelsRef.current = [...newActive];
          setFadeInPixels(newFadeIn);
          setTimeout(() => setFadeInPixels(new Set()), 300);
          if (currentIndex >= shuffledOrder.length) clearInterval(interval);
        }, intervalMs);
      }, 200);
    } else {
      // Utilisation de la ref pour vérifier l'état actuel de manière fiable
      const hasActivePixels = activePixelsRef.current.some(Boolean);
      if (!hasActivePixels) return;

      shuffledOrder =
        shuffledOrderRef.current.length === allPixels.length
          ? shuffledOrderRef.current
          : [...Array(allPixels.length).keys()];

      currentIndex = shuffledOrder.length - 1;
      newActive = [...activePixelsRef.current];
      setFadeInPixels(new Set());

      timeout = setTimeout(() => {
        interval = setInterval(() => {
          const newFadeOut = new Set();
          for (let i = 0; i < pixelsPerFrame && currentIndex >= 0; i++) {
            newActive[shuffledOrder[currentIndex]] = false;
            newFadeOut.add(shuffledOrder[currentIndex]);
            currentIndex--;
          }
          setActivePixels([...newActive]);
          activePixelsRef.current = [...newActive];
          setFadeOutPixels(newFadeOut);
          setTimeout(() => setFadeOutPixels(new Set()), 300);
          if (currentIndex < 0) clearInterval(interval);
        }, intervalMs);
      }, 200);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [isHovered, allPixels, logo, animationConfig]);

  useEffect(() => {
    if (!isWhiteLogo || !isHovered || allPixels.length === 0) {
      setGrayShades([]);
      return;
    }
    const updateGrayShades = () => {
      const shades = allPixels.map(() => {
        const grayValue = isDark
          ? 208 + Math.floor(Math.random() * 47)
          : Math.floor(Math.random() * 60);
        const hex = grayValue.toString(16).padStart(2, "0");
        return `#${hex}${hex}${hex}`;
      });
      setGrayShades(shades);
    };
    updateGrayShades();
    const grayInterval = setInterval(updateGrayShades, 400);
    return () => clearInterval(grayInterval);
  }, [isWhiteLogo, isHovered, allPixels.length, isDark]);

  useEffect(() => {
    if (!isHovered || allPixels.length === 0) {
      setShimmerPixels([]);
      return;
    }
    const updateShimmer = () => {
      const activeIndices = [];
      for (let i = 0; i < activePixels.length; i++) {
        if (activePixels[i]) activeIndices.push(i);
      }
      if (activeIndices.length === 0) return;
      const shimmerPercent = 0.3 + Math.random() * 0.4;
      const shimmerCount = Math.max(
        1,
        Math.min(100, Math.round(shimmerPercent * activeIndices.length)),
      );
      const shuffled = shuffle(activeIndices);
      setShimmerPixels(shuffled.slice(0, shimmerCount));
    };
    updateShimmer();
    const shimmerInterval = setInterval(updateShimmer, 500);
    return () => clearInterval(shimmerInterval);
  }, [isHovered, activePixels, allPixels.length]);

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
          color = grayShades[i] || (isDark ? "#e0e0e0" : "#404040");
        } else {
          color = colors[value] || colors[1];
        }
      } else {
        color = isDark ? "#f5f5f5" : "#000000";
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

      if (isWhiteLogo && isActive && !isFadingOut) {
        ctx.strokeStyle = isDark ? "#b0b0b0" : "#606060";
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

      if (isActive && isShimmering && !isFadingOut) {
        const shimmerOpacity = isWhiteLogo
          ? 0.5 + (i % 4) * 0.1
          : 0.3 + (i % 5) * 0.1;
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${shimmerOpacity})`
          : `rgba(0, 0, 0, ${shimmerOpacity})`;
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
    isDark,
  ]);

  return (
    <div
      key={logo} // GARANTIE ANTI-BUG : Recrée le composant à chaque changement de logo
      style={{ width: size, height: size, position: "relative" }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
      />
    </div>
  );
}
