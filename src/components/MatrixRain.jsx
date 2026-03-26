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
    const chars = "01アイウエオカキクケコ{}[]()=>const let class return import export async await @RestController @Autowired SpringBoot React Docker git".split("");

    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(0).map(() => Math.random() * -50);

    window.addEventListener("resize", () => {
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(0).map(() => Math.random() * -50);
    });

    const draw = () => {
      // Semi-transparent overlay to create trail effect
      ctx.fillStyle = "rgba(2, 6, 23, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const isBright = Math.random() > 0.95;

        ctx.font = `${fontSize}px monospace`;
        // Bright head character
        if (isBright) {
          ctx.fillStyle = "rgba(191, 219, 254, 0.95)"; // light blue-white
        } else {
          // Vary opacity for depth
          const opacity = 0.1 + Math.random() * 0.3;
          ctx.fillStyle = `rgba(37, 99, 235, ${opacity})`;
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

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
    />
  );
};

export default MatrixRain;