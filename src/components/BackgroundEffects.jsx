import React, { useMemo } from 'react';

const BackgroundEffects = () => {
  const stars = useMemo(() => {
    return [...Array(12)].map((_, i) => ({
      width: Math.random() * 2 + 1 + 'px',
      height: Math.random() * 2 + 1 + 'px',
      top: Math.random() * 40 + 5 + '%',
      left: Math.random() * 60 + 5 + '%',
      animationDelay: `${Math.random() * 4}s`,
      animationDuration: `${Math.random() * 3 + 3}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Twinkling Stars in the sky area (top left/center) */}
      {stars.map((style, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-twinkle motion-reduce:animate-none"
          style={style}
        />
      ))}

      {/* 2. Shooting Star */}
      <div 
        className="absolute top-0 right-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star motion-reduce:hidden"
        style={{ animationDelay: '5s' }}
      >
        <div className="absolute right-0 w-1 h-1 bg-white rounded-full blur-[1px]"></div>
      </div>
      
      {/* 3. Shooting Star (Alternate delay) */}
      <div 
        className="absolute top-[10%] left-[20%] w-24 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent animate-shooting-star motion-reduce:hidden"
        style={{ animationDelay: '14s' }}
      >
        <div className="absolute right-0 w-[2px] h-[2px] bg-white rounded-full blur-[1px]"></div>
      </div>

      {/* 4. Warm Lamp Glow (Subtle atmospheric pulse on the far right) */}
      <div 
        className="absolute w-[15vw] h-[15vw] rounded-full bg-lumi-yellow mix-blend-screen blur-[60px] opacity-40 animate-pulse-glow motion-reduce:animate-none right-[2%] bottom-[15%]"
        style={{ willChange: 'opacity, filter' }}
      ></div>
      
      {/* 6. Lumi Chest Star Glow (Kept soft and warm) */}
      <div 
        className="absolute w-[20vw] h-[20vw] rounded-full bg-[#FF9800] mix-blend-screen blur-[80px] opacity-60 animate-pulse-glow motion-reduce:animate-none right-[25%] bottom-[20%]"
        style={{ animationDelay: '2s', willChange: 'opacity, filter' }}
      ></div>
    </div>
  );
};

export default React.memo(BackgroundEffects);
