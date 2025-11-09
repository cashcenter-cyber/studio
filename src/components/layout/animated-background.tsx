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
    const numStars = 80; // Reduced from 150
    
    const offerIcons: any[] = [
      { type: 'emoji', value: '🎮', x: 0, y: 0, vx: 0, vy: 0, size: 40, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '🛍️', x: 0, y: 0, vx: 0, vy: 0, size: 38, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '💰', x: 0, y: 0, vx: 0, vy: 0, size: 42, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '🎲', x: 0, y: 0, vx: 0, vy: 0, size: 36, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '🎪', x: 0, y: 0, vx: 0, vy: 0, size: 40, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '🎁', x: 0, y: 0, vx: 0, vy: 0, size: 38, rotation: 0, rotationSpeed: 0 },
      { type: 'emoji', value: '💎', x: 0, y: 0, vx: 0, vy: 0, size: 35, rotation: 0, rotationSpeed: 0 },
    ];
    
    offerIcons.forEach(icon => {
        icon.x = Math.random() * canvas.width;
        icon.y = Math.random() * canvas.height;
        icon.vx = (Math.random() - 0.5) * 0.4;
        icon.vy = (Math.random() - 0.5) * 0.4;
        icon.rotationSpeed = (Math.random() - 0.5) * 0.02;
    });

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.0 + 1.0, // Made stars slightly smaller
      });
    }

    let animationFrameId: number;
    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lineColor = isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(8, 145, 178, 0.1)';

      stars.forEach((star, i) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? 'rgba(34, 211, 238, 0.9)'
          : 'rgba(8, 145, 178, 0.7)';
        ctx.shadowBlur = 8; // Reduced shadow blur
        ctx.shadowColor = isDark
          ? 'rgba(34, 211, 238, 0.4)'
          : 'rgba(8, 145, 178, 0.2)';
        ctx.fill();
        
        // Logic to draw lines between nearby stars
        for (let j = i + 1; j < stars.length; j++) {
            const otherStar = stars[j];
            const dx = star.x - otherStar.x;
            const dy = star.y - otherStar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { // Max distance to draw a line
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(otherStar.x, otherStar.y);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
      });
      
      ctx.shadowBlur = 0;
      offerIcons.forEach(icon => {
        icon.x += icon.vx;
        icon.y += icon.vy;
        icon.rotation += icon.rotationSpeed;

        if (icon.x < -50) icon.x = canvas.width + 50;
        if (icon.x > canvas.width + 50) icon.x = -50;
        if (icon.y < -50) icon.y = canvas.height + 50;
        if (icon.y > canvas.height + 50) icon.y = -50;

        ctx.save();
        ctx.translate(icon.x, icon.y);
        ctx.rotate(icon.rotation);
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = isDark ? 'rgba(34, 211, 238, 0.6)' : 'rgba(8, 145, 178, 0.4)';
        
        if (icon.type === 'emoji') {
          ctx.font = `${icon.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(icon.value, 0, 0);
        } else if (icon.type === 'image' && icon.value.complete) {
          const aspectRatio = icon.value.width / icon.value.height;
          const width = icon.size;
          const height = icon.size / aspectRatio;
          ctx.drawImage(icon.value, -width / 2, -height / 2, width, height);
        }
        
        ctx.restore();
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
