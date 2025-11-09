'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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
        radius: isDark ? Math.random() * 2.0 + 1.0 : Math.random() * 2.5 + 1.5,
      });
    }

    let animationFrameId: number;
    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const lineColor = isDark ? 'rgba(0, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';

        stars.forEach((star, i) => {
            star.x += star.vx;
            star.y += star.vy;

            if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
            if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            
            if (isDark) {
                const starColor = `rgba(0, 255, 255, ${Math.random() * 0.5 + 0.3})`;
                ctx.fillStyle = starColor;
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 5;
            }
            
            ctx.fill();

            // Reset shadow for lines
            ctx.shadowBlur = 0;

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
                    ctx.lineWidth = isDark ? 0.4 : 0.6;
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
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
            style={style}
        />
         {isDark && (
            <>
                <Image 
                    src="/big_1.png" 
                    alt="Floating element 1" 
                    width={400} 
                    height={400} 
                    className="absolute top-[10%] left-[5%] w-64 h-64 opacity-20 animate-float"
                />
                <Image 
                    src="/big_2.png" 
                    alt="Floating element 2" 
                    width={400} 
                    height={400} 
                    className="absolute bottom-[15%] right-[10%] w-80 h-80 opacity-20 animate-float-delay"
                />
                 <Image 
                    src="/small_1.png" 
                    alt="Floating element 3" 
                    width={150} 
                    height={150} 
                    className="absolute top-[50%] left-[25%] w-24 h-24 opacity-10 animate-float-fast"
                />
                <Image 
                    src="/small_2.png" 
                    alt="Floating element 4" 
                    width={150} 
                    height={150} 
                    className="absolute bottom-[30%] left-[15%] w-32 h-32 opacity-15 animate-float-slow"
                />
            </>
        )}
    </div>
  );
};

export default AnimatedBackground;
