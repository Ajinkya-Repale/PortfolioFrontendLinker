import { useEffect, useRef } from "react";

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const fontSize = 14;

    const chars =
      "01アイウエオカキクケコ{}[]()=>const let class return import export async await @RestController @Autowired SpringBoot React Docker git".split(
        ""
      );

    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols)
      .fill(0)
      .map(() => Math.random() * -50);

    window.addEventListener("resize", () => {
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols)
        .fill(0)
        .map(() => Math.random() * -50);
    });

    const draw = () => {
      // slightly lighter overlay so characters pop more
      ctx.fillStyle = "rgba(2, 6, 23, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isBright = Math.random() > 0.95;

        ctx.font = `${fontSize}px monospace`;

        // bright leading character
        if (isBright) {
          ctx.fillStyle = "rgba(219, 234, 254, 1)"; // brighter blue-white
        } else {
          const opacity = 0.25 + Math.random() * 0.5; // brighter base opacity
          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`; // brighter blue
        }

        ctx.fillText(char, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      });
    };

    const interval = setInterval(draw, 60);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
};

export default MatrixRain;