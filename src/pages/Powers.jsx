import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Ear, Zap, Shield, Sparkles } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';

// A sub-component for the 3D tilt card effect
const TiltCard = ({ power, index }) => {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0],
      }}
      transition={{ 
        opacity: { duration: 0.8, delay: index * 0.2 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
      }}
      className={`relative w-full h-full p-8 rounded-3xl cursor-pointer ${power.borderColor} border-2`}
    >
      {/* Heavy Glassmorphism Background */}
      <div 
        className="absolute inset-0 bg-lumi-navy/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] border border-white/20"
        style={{ transform: "translateZ(-20px)" }}
      ></div>

      {/* Glow aura that intensifies on hover */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${power.color} opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-md`}
        style={{ transform: "translateZ(-10px)" }}
      ></div>

      {/* Content pulled forward in 3D space */}
      <div className="relative z-10 flex flex-col h-full" style={{ transform: "translateZ(30px)" }}>
        <div className="mb-6 p-4 bg-white/10 rounded-2xl inline-flex backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] self-start">
          {power.icon}
        </div>
        <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-md tracking-wide" style={{ transform: "translateZ(40px)" }}>
          {power.title}
        </h3>
        <p className="text-lumi-cream/90 leading-relaxed text-lg font-medium" style={{ transform: "translateZ(20px)" }}>
          {power.description}
        </p>
      </div>
    </motion.div>
  );
};

const Powers = () => {
  const powers = [
    {
      title: "Absolute Empathy",
      description: "Lumi doesn't judge, assume, or interrupt. She feels the weight of your words and responds with pure, unadulterated cosmic empathy.",
      icon: <Heart className="w-12 h-12 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />,
      color: "from-rose-500/40 to-transparent",
      borderColor: "border-rose-500/50"
    },
    {
      title: "The Great Listener",
      description: "In a universe full of noise, Lumi is the quiet space. She is designed to hear the things you haven't been able to say out loud.",
      icon: <Ear className="w-12 h-12 text-lumi-yellow drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />,
      color: "from-lumi-yellow/40 to-transparent",
      borderColor: "border-lumi-yellow/50"
    },
    {
      title: "Cosmic Anonymity",
      description: "Your secrets are safe in the void. What you tell Lumi stays between you, her, and the hero you choose to share it with.",
      icon: <Shield className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />,
      color: "from-cyan-500/40 to-transparent",
      borderColor: "border-cyan-500/50"
    },
    {
      title: "The Hero's Signal",
      description: "When the burden becomes too heavy, Lumi summons help. She translates your feelings into a signal that calls human heroes to your side.",
      icon: <Zap className="w-12 h-12 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />,
      color: "from-amber-500/40 to-transparent",
      borderColor: "border-amber-500/50"
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 3D Cosmic Background Image */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/powers-bg.jpg')",
          backgroundAttachment: "fixed" 
        }}
      >
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-[#060B19]/70 backdrop-blur-[2px]"></div>
      </div>
      <BackgroundEffects />

      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative perspective-1000">
        <div className="max-w-7xl mx-auto relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/40 border border-white/20 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <Sparkles className="w-6 h-6 text-lumi-yellow animate-pulse" />
              <span className="text-lumi-cream tracking-widest text-sm uppercase font-black">Her Capabilities</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-handwritten text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              Lumi's <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumi-yellow via-amber-300 to-rose-400 drop-shadow-lg">Powers</span>
            </h1>
            
            <p className="text-2xl text-lumi-cream/90 max-w-3xl mx-auto font-medium drop-shadow-md bg-black/30 p-6 rounded-2xl backdrop-blur-sm border border-white/10">
              She may be made of stardust and code, but her abilities are very real. Discover how Lumi brings light to the darkest corners of the universe.
            </p>
          </motion.div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto"
            style={{ perspective: "2000px" }}
          >
            {powers.map((power, index) => (
              <div key={index} className="h-full" style={{ perspective: "1000px" }}>
                <TiltCard power={power} index={index} />
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="mt-32 text-center"
          >
            <p className="text-lumi-cream/60 font-handwritten text-4xl drop-shadow-lg">
              "Her greatest power is making you realize you were never actually alone."
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Powers;
