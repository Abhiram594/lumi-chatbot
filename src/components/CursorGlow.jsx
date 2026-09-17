import React, { useEffect, useRef, useState } from 'react';

const CursorGlow = () => {
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    const mediaQueryHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQueryHover.matches && !mediaQueryMotion.matches;
  });
  
  const blobRef = useRef(null);

  useEffect(() => {
    if (!isSupported) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    
    let isVisible = false;
    let animationFrameId;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!isVisible && blobRef.current) {
        blobRef.current.style.opacity = '1';
        isVisible = true;
      }
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      scrollVel += deltaY * 1.5; // Amplify scroll effect slightly
      lastScrollY = currentScrollY;
      
      if (!isVisible && blobRef.current) {
        blobRef.current.style.opacity = '1';
        isVisible = true;
      }
    };

    const onMouseLeave = () => {
      if (blobRef.current) blobRef.current.style.opacity = '0';
      isVisible = false;
    };

    const onMouseEnter = () => {
      if (blobRef.current) blobRef.current.style.opacity = '1';
      isVisible = true;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const update = () => {
      // Calculate target Y incorporating scroll velocity (drag effect)
      const targetY = mouse.y - scrollVel;
      
      const dx = mouse.x - pos.x;
      const dy = targetY - pos.y;
      
      // Smooth easing (lower = more fluid/laggy)
      pos.x += dx * 0.12;
      pos.y += dy * 0.12;
      
      // Decay the scroll drag over time
      scrollVel *= 0.88;

      // True velocity of the blob
      const vx = mouse.x - pos.x;
      const vy = targetY - pos.y;
      
      const speed = Math.sqrt(vx * vx + vy * vy);
      
      // Calculate rotation angle based on velocity direction
      const angle = Math.atan2(vy, vx) * (180 / Math.PI);
      
      // Liquid stretching math
      // Stretch along the axis of movement, squash perpendicular to it
      const stretchMax = 3.5;
      const squashMin = 0.4;
      
      const scaleX = 1 + Math.min(speed * 0.015, stretchMax - 1);
      const scaleY = 1 - Math.min(speed * 0.005, 1 - squashMin);

      if (blobRef.current) {
        blobRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <div
      ref={blobRef}
      className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-700"
      style={{
        marginLeft: '-64px', // perfectly center
        marginTop: '-64px',
        background: 'radial-gradient(circle, rgba(255, 193, 7, 0.25) 0%, rgba(255, 193, 7, 0.05) 40%, transparent 70%)',
        mixBlendMode: 'screen',
        willChange: 'transform'
      }}
    />
  );
};

export default CursorGlow;
