/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  hasLeafShape: boolean;
}

export default function FallingPetals() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollPosRef = useRef(0);
  const scrollSpeedRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const speed = Math.min(Math.abs(currentScroll - scrollPosRef.current) / 10, 8);
      scrollSpeedRef.current = speed;
      scrollPosRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track outer dimension changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    resizeObserver.observe(canvas.parentElement || document.body);

    // Pastel Romantic colors for flower petals and small leaves
    const colors = [
      'rgba(255, 182, 193, 0.75)', // Light Pink
      'rgba(255, 192, 203, 0.65)', // Pink
      'rgba(244, 143, 177, 0.55)', // Rose Pink
      'rgba(255, 240, 245, 0.85)', // Lavender Blush
      'rgba(230, 230, 250, 0.70)', // Lavender
      'rgba(255, 218, 185, 0.60)', // Peach Puff
    ];

    const petals: Petal[] = [];
    const maxPetals = 40;

    const createPetal = (isInitial = false): Petal => {
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -20,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() * 0.02 - 0.01) * Math.PI,
        opacity: Math.random() * 0.4 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        hasLeafShape: Math.random() > 0.4,
      };
    };

    // Instantiate initial set
    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((petal, index) => {
        // Petal update
        // Scroll speed adds temporary velocity and sway for physical responsiveness
        const currentSpeedY = petal.speedY + scrollSpeedRef.current * 0.4;
        const currentSpeedX = petal.speedX + Math.sin(petal.y / 30) * 0.2 + scrollSpeedRef.current * 0.1;

        petal.y += currentSpeedY;
        petal.x += currentSpeedX;
        petal.rotation += petal.rotationSpeed + scrollSpeedRef.current * 0.005;

        // Reset if offtarget or bottom
        if (petal.y > height + 20 || petal.x < -20 || petal.x > width + 20) {
          petals[index] = createPetal(false);
          return;
        }

        // Draw Petal
        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.rotation);
        ctx.scale(1, 0.6); // squish visually to simulate flat floating disk
        ctx.beginPath();
        
        ctx.fillStyle = petal.color;
        
        if (petal.hasLeafShape) {
          // Draw standard cherry blossom double-arc leaf
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-petal.size, -petal.size, -petal.size / 2, -petal.size * 1.5, 0, -petal.size * 2);
          ctx.bezierCurveTo(petal.size / 2, -petal.size * 1.5, petal.size, -petal.size, 0, 0);
        } else {
          // Draw sweet cute round rose petal
          ctx.arc(0, 0, petal.size, 0, Math.PI * 2);
        }

        ctx.fill();

        // Highlight stroke for depth
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      });

      // Decay scrollSpeed back down slowly
      scrollSpeedRef.current = Math.max(0, scrollSpeedRef.current - 0.2);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      id="falling-petals-canvas"
    />
  );
}
