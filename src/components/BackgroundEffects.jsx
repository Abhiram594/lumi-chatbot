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
        className="absolute w-[30vw] md:w-[15vw] h-[30vw] md:h-[15vw] rounded-full mix-blend-screen opacity-40 animate-pulse-glow motion-reduce:animate-none right-0 md:right-[2%] bottom-[10%] md:bottom-[15%] bg-[radial-gradient(circle,rgba(255,193,7,0.8)_0%,transparent_70%)]"
        style={{ willChange: 'opacity' }}
      ></div>
      
      {/* 6. Lumi Chest Star Glow (Kept soft and warm) */}
      <div 
        className="absolute w-[40vw] md:w-[20vw] h-[40vw] md:h-[20vw] rounded-full mix-blend-screen opacity-60 animate-pulse-glow motion-reduce:animate-none right-[15%] md:right-[25%] bottom-[15%] md:bottom-[20%] bg-[radial-gradient(circle,rgba(255,152,0,0.8)_0%,transparent_70%)]"
        style={{ animationDelay: '2s', willChange: 'opacity' }}
      ></div>
    </div>
  );
};

export default React.memo(BackgroundEffects);
