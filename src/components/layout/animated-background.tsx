'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mounted) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.body.scrollHeight,
        window.innerHeight
      );
    };

    updateCanvasSize();

    const stars: any[] = [];
    const numStars = 150;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let animationFrameId: number;
    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const lineColor = isDark ? 'rgba(0, 255, 255, 0.08)' : 'rgba(8, 145, 178, 0.1)';

        stars.forEach((star, i) => {
            star.x += star.vx;
            star.y += star.vy;

            if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            const starColor = isDark ? `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.3})` : `rgba(8, 145, 178, ${Math.random() * 0.5 + 0.3})`;
            ctx.fillStyle = starColor;
            ctx.fill();

            for (let j = i + 1; j < stars.length; j++) {
                const otherStar = stars[j];
                const dx = star.x - otherStar.x;
                const dy = star.y - otherStar.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) { // Max distance to draw a line
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(otherStar.x, otherStar.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.3;
                    ctx.stroke();
                }
            }
        });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isDark, mounted]);
  
  const style = {
      opacity: !mounted ? 0 : (isDark ? 0.6 : 0.4)
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-opacity duration-500"
      style={style}
    />
  );
};

export default AnimatedBackground;
