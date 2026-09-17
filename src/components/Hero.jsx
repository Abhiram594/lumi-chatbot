import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 hero-bg overflow-hidden">
      {/* Subtle overlay to ensure text readability against the sky */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/80 via-[#0A192F]/40 to-transparent w-full md:w-2/3 lg:w-1/2 z-0"></div>
      
      {/* Additional subtle dark overlay for mobile to make text pop */}
      <div className="absolute inset-0 bg-[#0A192F]/40 md:hidden z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-handwritten text-6xl md:text-8xl text-lumi-cream leading-tight mb-4 drop-shadow-lg">
              You Talk.<br />
              <span className="text-lumi-yellow relative">
                Lumi Listens.
                {/* Underline decorative element */}
                <svg className="absolute w-full h-4 -bottom-2 left-0 text-lumi-yellow opacity-80" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,5 Q100,10 200,0" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            
            <p className="mt-6 text-xl md:text-2xl text-lumi-cream/90 max-w-lg font-medium drop-shadow-md">
              Got something on your mind?<br />
              Big or small, you can talk to Lumi.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.hash = '#/talk'}
                className="bg-lumi-yellow hover:bg-lumi-yellow-hover hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] text-lumi-midnight font-bold text-lg py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-lumi-yellow/20 focus:outline-none focus:ring-4 focus:ring-white/50 w-full sm:w-auto"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Talk to Lumi →</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Standalone Lumi Character Container */}
      <div className="absolute right-[15%] md:right-[22%] lg:right-[26%] xl:right-[30%] top-[50%] mt-[12%] -translate-y-1/2 w-[48%] md:w-[34%] lg:w-[28%] xl:w-[25%] max-w-[400px] z-10 pointer-events-none flex justify-center items-center">
        
        {/* Animated Cape */}
        <motion.img 
          src="/lumi-cape.png" 
          alt="Lumi Cape"
          loading="eager"
          className="absolute w-[105%] h-auto origin-[50%_15%] z-0"
          style={{ top: '38%', left: '-2%', willChange: 'transform' }}
          animate={{ 
            rotateZ: [-1, 4, -2, 3, -1], 
            rotateY: [0, 12, -4, 8, 0],
            skewX: [-2, 4, -1, 3, -2],
            scaleX: [1, 1.04, 0.98, 1.03, 1],
            scaleY: [1, 1.03, 0.99, 1.02, 1],
            y: [0, -6, 2, -4, 0],
            x: [0, 3, -1, 4, 0]
          }}
          transition={{ 
            duration: 14, 
            ease: "easeInOut", 
            repeat: Infinity
          }}
        />

        {/* Static Body */}
        <img 
          src="/lumi-capeless-v3.png" 
          alt="Lumi Body" 
          fetchpriority="high"
          loading="eager"
          className="relative w-full h-auto z-10 drop-shadow-lg md:drop-shadow-2xl"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />

      </div>
      
      <BackgroundEffects />
    </div>
  );
};

export default React.memo(Hero);
