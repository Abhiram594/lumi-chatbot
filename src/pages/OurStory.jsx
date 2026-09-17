import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Heart, Sparkles, Compass, Radio, Ear, MessageCircle, Brain, AlertCircle, Flag } from 'lucide-react';
import Navbar from '../components/Navbar';

const OurStory = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 0.8 });

  // --- MAPPED SCROLL RANGES FOR 1000vh ---

  // --- 1. INTRO (0.00 - 0.08) ---
  const introOpacity = useTransform(smoothProgress, [0, 0.0457], [1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.0457], [0, -50]);

  // --- 2. TIMELINE & SIGNAL (0.04 - 1.0) ---
  const signalY = useTransform(smoothProgress, [0.0286, 0.2, 0.7143, 0.95], ["-10vh", "50vh", "90vh", "150vh"]);
  const timelineHeight = useTransform(smoothProgress, [0.0286, 0.2, 0.7143, 0.95], ["0vh", "50vh", "90vh", "150vh"]);
  const signalOpacity = useTransform(smoothProgress, [0, 0.0286, 0.95, 1.0], [0, 1, 1, 0]);

  // --- 3. THE SIGNAL CH1 TEXT (0.096 - 0.224) ---
  const ch1TextOpacity = useTransform(smoothProgress, [0.0686, 0.0857, 0.1429, 0.16], [0, 1, 1, 0]);
  const ch1TextY = useTransform(smoothProgress, [0.0686, 0.0857, 0.1429, 0.16], [20, 0, 0, -20]);

  // --- 4. GATHERING (0.24 - 0.28) ---
  const gatherScale = useTransform(smoothProgress, [0.1714, 0.2], [2, 0.2]);
  const gatherOpacity = useTransform(smoothProgress, [0.1714, 0.1886, 0.2], [0, 1, 0]);

  // --- 5. THE SPARK (0.28 - 0.32) ---
  const sparkScale = useTransform(smoothProgress, [0.2, 0.2114, 0.2286], [0, 1, 1.5]);
  const sparkOpacity = useTransform(smoothProgress, [0.2, 0.2114, 0.2229, 0.2286], [0, 1, 1, 0]);

  // --- 6. ENERGY (0.28 - 0.336) ---
  const energyScale = useTransform(smoothProgress, [0.2, 0.2286], [0.2, 1]);
  const energyOpacity = useTransform(smoothProgress, [0.2, 0.2171, 0.2286, 0.24], [0, 1, 1, 0]); 
  
  const radiateScale = useTransform(smoothProgress, [0.2, 0.24], [0.5, 1.5]);
  const radiateOpacity = useTransform(smoothProgress, [0.2, 0.2171, 0.24], [0, 1, 0]);

  // --- 7. LUMI MATERIALIZES (0.28 -> Fades out at Ch4 start) ---
  const lumiOpacity = useTransform(smoothProgress, [0.2, 0.2286, 0.5143, 0.5429], [0, 1, 1, 0]); 
  const lumiScale = useTransform(smoothProgress, [0.2, 0.2286, 0.4, 0.5714], [0.9, 1, 1, 1.05]); 
  const lumiY = useTransform(smoothProgress, [0.2, 0.2286, 0.4, 0.5714], [40, 0, 0, -10]);

  // --- 8. CH2 STORY TEXT (0.328 - 0.472) ---
  const ch2HeaderOpacity = useTransform(smoothProgress, [0.2286, 0.24, 0.3314, 0.3429], [0, 1, 1, 0]);
  const ch2Text1Opacity = useTransform(smoothProgress, [0.2343, 0.2457, 0.2743, 0.2857], [0, 1, 1, 0]);
  const ch2Text1Y = useTransform(smoothProgress, [0.2343, 0.2457, 0.2743, 0.2857], [15, 0, 0, -15]);
  const ch2Text2Opacity = useTransform(smoothProgress, [0.2914, 0.3029, 0.3257, 0.3371], [0, 1, 1, 0]);
  const ch2Text2Y = useTransform(smoothProgress, [0.2914, 0.3029, 0.3257, 0.3371], [15, 0, 0, -15]);

  // --- 9. CITY TRANSITION (0.44 - 0.52) ---
  const cityOpacity = useTransform(smoothProgress, [0.3143, 0.3714, 0.5429, 0.5714], [0, 1, 1, 0]);
  const bgParallaxY = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const nebulaParallaxY = useTransform(smoothProgress, [0, 1], ["10vh", "-10vh"]); 

  // --- 10. GLOWING CITY POINTS (0.48 - 0.64) ---
  const point1Opacity = useTransform(smoothProgress, [0.3429, 0.3714, 0.5429, 0.5714], [0, 1, 1, 0]);
  const point2Opacity = useTransform(smoothProgress, [0.36, 0.3886, 0.5429, 0.5714], [0, 1, 1, 0]);
  const point3Opacity = useTransform(smoothProgress, [0.3771, 0.4057, 0.5429, 0.5714], [0, 1, 1, 0]);
  const point4Opacity = useTransform(smoothProgress, [0.3943, 0.4229, 0.5429, 0.5714], [0, 1, 1, 0]);
  const point5Opacity = useTransform(smoothProgress, [0.4114, 0.44, 0.5429, 0.5714], [0, 1, 1, 0]);
  const point6Opacity = useTransform(smoothProgress, [0.4286, 0.4571, 0.5429, 0.5714], [0, 1, 1, 0]);

  // --- 11. CH3 STORY TEXT SEQUENCES (0.52 - 0.76) ---
  const ch3Text1Opacity = useTransform(smoothProgress, [0.3714, 0.3886, 0.4114, 0.4286], [0, 1, 1, 0]);
  const ch3Text1Y = useTransform(smoothProgress, [0.3714, 0.3886, 0.4114, 0.4286], [15, 0, 0, -15]);
  const ch3Text2Opacity = useTransform(smoothProgress, [0.4286, 0.4457, 0.4857, 0.5029], [0, 1, 1, 0]);
  const ch3Text2Y = useTransform(smoothProgress, [0.4286, 0.4457, 0.4857, 0.5029], [15, 0, 0, -15]);
  const ch3Text3Opacity = useTransform(smoothProgress, [0.5029, 0.5257, 0.5429, 0.5714], [0, 1, 1, 0]);
  const ch3Text3Y = useTransform(smoothProgress, [0.5029, 0.5257, 0.5429, 0.5714], [15, 0, 0, -15]);
  const lineOpacity = useTransform(smoothProgress, [0.5257, 0.5486, 0.5429, 0.5714], [0, 0.4, 0.4, 0]);

  // --- 12. CH4 POWERS CONSTELLATION (0.80 - 1.0) ---
  const ch4Opacity = useTransform(smoothProgress, [0.5714, 0.6, 0.62, 0.65], [0, 1, 1, 0]);
  const ch4Display = useTransform(smoothProgress, [0.57, 0.5714, 0.65, 0.66], ["none", "flex", "flex", "none"]);
  const ch4LumiScale = useTransform(smoothProgress, [0.5714, 0.6, 0.62, 0.65], [0.8, 1, 1, 0.8]);
  
  const ch4Node1Opacity = useTransform(smoothProgress, [0.5857, 0.6], [0, 1]);
  const ch4Node2Opacity = useTransform(smoothProgress, [0.5929, 0.6071], [0, 1]);
  const ch4Node3Opacity = useTransform(smoothProgress, [0.6, 0.6143], [0, 1]);
  const ch4Node4Opacity = useTransform(smoothProgress, [0.6071, 0.6214], [0, 1]);
  const ch4Node5Opacity = useTransform(smoothProgress, [0.6143, 0.6286], [0, 1]);

  // --- 13. CH5 THE MISSION (0.65 - 1.0) ---
  const ch5Opacity = useTransform(smoothProgress, [0.65, 0.68, 0.98, 1.0], [0, 1, 1, 0]);
  const ch5Display = useTransform(smoothProgress, [0.64, 0.65, 1.0], ["none", "flex", "flex"]);
  const ch5PathConvergence = useTransform(smoothProgress, [0.90, 0.94], [0, 1]);
  const ch5LumiScale = useTransform(ch5PathConvergence, [0, 1], [1, 1.3]);
  const rightTextOpacity = useTransform(smoothProgress, [0.92, 0.94], [0, 1]);

  const desktopNodeYs = [15, 30, 45, 60, 75, 92];
  const mobileNodeYs = [15, 30, 45, 60, 75, 92];
  const desktopNodeLabels = ["Problem", "Talk", "Listen", "Understand", "Find a way", "Next step"];
  
  const nodeXs = [
    useTransform(ch5PathConvergence, [0, 1], ["30%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["70%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["30%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["70%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["30%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["50%", "50%"])
  ];
  const mNodeXs = [
    useTransform(ch5PathConvergence, [0, 1], ["15%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["85%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["15%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["85%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["15%", "50%"]),
    useTransform(ch5PathConvergence, [0, 1], ["50%", "50%"])
  ];

  const [activeMissionNode, setActiveMissionNode] = useState(0);
  const [activeMissionHover, setActiveMissionHover] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activePower, setActivePower] = useState(null);

  useEffect(() => {
    let currentChapter = 0;
    let currentMissionNode = 0;

    return smoothProgress.onChange((latest) => {
      let nextChapter = 0;
      if (latest < 0.0571) nextChapter = 0;
      else if (latest >= 0.0571 && latest < 0.2286) nextChapter = 1;
      else if (latest >= 0.2286 && latest < 0.3714) nextChapter = 2;
      else if (latest >= 0.3714 && latest < 0.5714) nextChapter = 3;
      else if (latest >= 0.5714 && latest < 0.65) nextChapter = 4;
      else if (latest >= 0.65) nextChapter = 5;

      if (nextChapter !== currentChapter) {
        currentChapter = nextChapter;
        setActiveChapter(nextChapter);
      }

      let nextNode = 0;
      if (latest >= 0.65 && latest < 0.70) nextNode = 0;
      else if (latest >= 0.70 && latest < 0.75) nextNode = 1;
      else if (latest >= 0.75 && latest < 0.80) nextNode = 2;
      else if (latest >= 0.80 && latest < 0.85) nextNode = 3;
      else if (latest >= 0.85 && latest < 0.90) nextNode = 4;
      else if (latest >= 0.90) nextNode = 5;

      if (nextNode !== currentMissionNode) {
        currentMissionNode = nextNode;
        setActiveMissionNode(nextNode);
      }
    });
  }, [smoothProgress]);

  const chapters = [
    { num: '01', title: 'The Signal' },
    { num: '02', title: 'The Spark' },
    { num: '03', title: 'The Discovery' },
    { num: '04', title: 'The Powers' },
    { num: '05', title: 'The Mission' },
  ];

  const powers = [
    { 
      id: 0, 
      title: "EMPATHY LINK", 
      desc: "I listen closely, so you never have to explain everything perfectly.", 
      pos: "top-[0%] left-[50%]",
      boxPos: "top-full mt-4 left-1/2 -translate-x-1/2",
      icon: Heart
    },
    { 
      id: 1, 
      title: "HOPE LIGHT", 
      desc: "Even when things feel heavy, there's always a little light to find.", 
      pos: "top-[25%] right-[10%] md:top-[25%] md:right-[20%]",
      boxPos: "top-full mt-4 right-0 md:top-1/2 md:-translate-y-1/2 md:right-full md:mr-6",
      icon: Sparkles
    },
    { 
      id: 2, 
      title: "GUIDANCE MODE", 
      desc: "You don't need all the answers. Let's figure out the next step.", 
      pos: "bottom-[15%] right-[15%] md:bottom-[15%] md:right-[25%]",
      boxPos: "bottom-full mb-4 right-0 md:top-1/2 md:-translate-y-1/2 md:right-full md:mr-6",
      icon: Compass
    },
    { 
      id: 3, 
      title: "GLOBAL SIGNAL", 
      desc: "Your voice can travel further than you think. I'll help connect it.", 
      pos: "bottom-[15%] left-[15%] md:bottom-[15%] md:left-[25%]",
      boxPos: "bottom-full mb-4 left-0 md:top-1/2 md:-translate-y-1/2 md:left-full md:ml-6",
      icon: Radio
    },
    {
      id: 4,
      title: "LISTENING CORE",
      desc: "Sometimes the most powerful thing is simply being heard.",
      pos: "top-[25%] left-[10%] md:top-[25%] md:left-[20%]",
      boxPos: "top-full mt-4 left-0 md:top-1/2 md:-translate-y-1/2 md:left-full md:ml-6",
      icon: Ear
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Main Scroll Container (1000vh for Ch 1, 2, 3, 4 pacing) */}
      <div ref={containerRef} className="relative bg-lumi-midnight min-h-[1400vh] text-lumi-cream overflow-hidden">
        
        {/* Progress Indicator Sidebar */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6">
          {chapters.map((chapter, i) => {
            const isActive = activeChapter === i + 1;
            return (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className={`text-xs font-bold transition-colors duration-500 ${isActive ? 'text-lumi-yellow' : 'text-white/30'}`}>
                  {chapter.num}
                </div>
                <div className={`h-px transition-all duration-500 ${isActive ? 'w-8 bg-lumi-yellow shadow-[0_0_10px_rgba(255,193,7,0.8)]' : 'w-4 bg-white/20'}`}></div>
                <div className={`text-xs tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'text-lumi-yellow opacity-100' : 'text-white/50 opacity-0 -translate-x-4'}`}>
                  {chapter.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- FIXED CINEMATIC STAGE --- */}
        <div className="fixed inset-0 z-0 pointer-events-none flex flex-col items-center">
          
          {/* Backgrounds */}
          <div className="absolute inset-0 bg-[#060B19] z-0"></div>
          
          <motion.div 
            className="absolute inset-0 z-0 pointer-events-none opacity-50 scale-[1.2]" 
            style={{ 
              y: nebulaParallaxY,
              backgroundImage: "url('/story-galaxy-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />

          {/* Vignette to keep text readable and edges dark */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#060B19_100%)] opacity-80 z-0 pointer-events-none" />
          
          <motion.div 
            className="absolute -top-[20%] -bottom-[100%] -left-[10%] -right-[10%] z-0 pointer-events-none"
            style={{ y: bgParallaxY }}
          >
            {/* Tiny Golden Stars */}
            {useMemo(() => [...Array(20)].map((_, i) => (
              <div 
                key={`g-${i}`} 
                className={`absolute rounded-full bg-lumi-yellow ${i % 4 === 0 ? 'animate-pulse' : ''}`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 1.5 + 0.5}px`,
                  height: `${Math.random() * 1.5 + 0.5}px`,
                  opacity: Math.random() * 0.4 + 0.2,
                }}
              />
            )), [])}
            {/* Standard White Stars */}
            {useMemo(() => [...Array(40)].map((_, i) => (
              <div 
                key={`w-${i}`} 
                className="absolute rounded-full bg-white/40"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                }}
              />
            )), [])}
            
            {/* Occasional Soft Orbital Lines (Reference image style) */}
            <div className="absolute top-[30%] left-[10%] w-[120vw] h-[120vw] rounded-full border border-white/5 -rotate-12 opacity-30" />
            <div className="absolute -top-[10%] -right-[20%] w-[100vw] h-[100vw] rounded-full border border-lumi-yellow/5 rotate-45 opacity-20" />
          </motion.div>

          {/* CH3 CITY ENVIRONMENT */}
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-[50vh] z-0 pointer-events-none"
            style={{ opacity: cityOpacity }}
          >
            <div className="absolute bottom-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_rgba(234,179,8,0.06)_0%,_transparent_70%)] z-0"></div>
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[40vh] fill-[#060b19] z-10 opacity-80">
              <path d="M0,200 L0,150 L50,150 L50,100 L120,100 L120,120 L200,120 L200,60 L280,60 L280,140 L350,140 L350,80 L420,80 L420,130 L500,130 L500,70 L580,70 L580,110 L650,110 L650,50 L720,50 L720,120 L800,120 L800,90 L880,90 L880,140 L950,140 L950,100 L1000,100 L1000,200 Z" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>

            <div className="absolute inset-0 z-20">
              <motion.div className="absolute left-[15%] bottom-[30%] w-2 h-2 rounded-full bg-lumi-yellow shadow-[0_0_12px_rgba(255,193,7,0.8)]" style={{ opacity: point1Opacity }}>
                <div className="absolute inset-0 bg-lumi-yellow rounded-full animate-ping opacity-75"></div>
              </motion.div>
              <motion.div className="absolute left-[35%] bottom-[45%] w-1.5 h-1.5 rounded-full bg-lumi-yellow shadow-[0_0_8px_rgba(255,193,7,0.8)]" style={{ opacity: point2Opacity }}>
                <div className="absolute inset-0 bg-lumi-yellow rounded-full animate-ping opacity-75"></div>
              </motion.div>
              <motion.div className="absolute left-[55%] bottom-[35%] w-2.5 h-2.5 rounded-full bg-[#fcd34d] shadow-[0_0_15px_rgba(255,193,7,0.9)]" style={{ opacity: point3Opacity }}>
                <div className="absolute inset-0 bg-[#fcd34d] rounded-full animate-ping opacity-75"></div>
              </motion.div>
              <motion.div className="absolute left-[25%] bottom-[55%] w-1.5 h-1.5 rounded-full bg-[#fde68a] shadow-[0_0_8px_rgba(255,193,7,0.8)]" style={{ opacity: point4Opacity }}>
                <div className="absolute inset-0 bg-[#fde68a] rounded-full animate-ping opacity-75"></div>
              </motion.div>
              <motion.div className="absolute left-[70%] bottom-[40%] w-2 h-2 rounded-full bg-lumi-yellow shadow-[0_0_12px_rgba(255,193,7,0.8)]" style={{ opacity: point5Opacity }}>
                <div className="absolute inset-0 bg-lumi-yellow rounded-full animate-ping opacity-75"></div>
              </motion.div>
              <motion.div className="absolute left-[45%] bottom-[25%] w-1.5 h-1.5 rounded-full bg-[#fef3c7] shadow-[0_0_6px_rgba(255,193,7,0.7)]" style={{ opacity: point6Opacity }}>
                <div className="absolute inset-0 bg-[#fef3c7] rounded-full animate-ping opacity-75"></div>
              </motion.div>
            </div>
            
            <motion.svg className="absolute inset-0 w-full h-full z-10" style={{ opacity: lineOpacity }}>
               <line x1="15%" y1="70%" x2="70%" y2="-50%" stroke="rgba(255,193,7,0.15)" strokeWidth="1" />
               <line x1="35%" y1="55%" x2="72%" y2="-40%" stroke="rgba(255,193,7,0.1)" strokeWidth="1" />
               <line x1="55%" y1="65%" x2="75%" y2="-45%" stroke="rgba(255,193,7,0.2)" strokeWidth="1" />
               <line x1="25%" y1="45%" x2="68%" y2="-30%" stroke="rgba(255,193,7,0.1)" strokeWidth="1" />
            </motion.svg>
          </motion.div>

          {/* 1. CONTINUOUS TIMELINE LINE */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full z-10 flex flex-col justify-start items-center">
            <div className="absolute inset-0 bg-white/5" />
            <motion.div 
              className="absolute top-0 w-full bg-gradient-to-b from-transparent via-lumi-yellow/50 to-lumi-yellow" 
              style={{ height: timelineHeight }}
            />
          </div>

          {/* 2. THE SIGNAL (Shooting Star continuously traveling down) */}
          <motion.div 
            className="absolute top-0 left-1/2 z-20 flex flex-col items-center"
            style={{ y: signalY, opacity: signalOpacity, x: "-50%" }}
          >
            <div className="relative flex flex-col items-center">
              <div 
                className="w-1.5 h-24 sm:h-32 bg-gradient-to-t from-[#ffd700] via-[#ffd700]/60 to-transparent opacity-90"
                style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.8))' }} 
              />
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#ffd700] drop-shadow-[0_0_12px_rgba(255,193,7,1)] -mt-3">
                <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5Z" />
              </svg>
            </div>
          </motion.div>

          {/* 3. GATHERING PARTICLES */}
          <motion.div 
            className="absolute top-[50vh] left-1/2 z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: gatherOpacity, scale: gatherScale }}
          >
            {[...Array(8)].map((_, i) => (
              <div key={`g-${i}`} className="absolute w-[2px] h-[2px] bg-lumi-yellow rounded-full" style={{ transform: `rotate(${i * 45}deg) translateY(-80px)` }} />
            ))}
          </motion.div>

          {/* 4. THE SPARK */}
          <motion.div 
            className="absolute top-[50vh] left-1/2 z-20 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: sparkOpacity, scale: sparkScale }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white drop-shadow-[0_0_20px_rgba(255,193,7,1)]">
              <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5Z" />
            </svg>
          </motion.div>

          {/* 5. ENERGY GLOW & RADIATING PARTICLES */}
          <motion.div 
            className="absolute top-[50vh] left-1/2 z-10 flex items-center justify-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: energyOpacity, scale: energyScale }}
          >
            <div className="absolute w-[20vh] h-[20vh] bg-[radial-gradient(circle,rgba(255,193,7,0.1)_0%,transparent_70%)] rounded-full mix-blend-screen" />
          </motion.div>

          <motion.div 
            className="absolute top-[50vh] left-1/2 z-20 flex items-center justify-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: radiateOpacity, scale: radiateScale }}
          >
            {[...Array(8)].map((_, i) => (
              <div key={`r-${i}`} className="absolute w-[2px] h-[2px] bg-white/60 rounded-full shadow-[0_0_5px_rgba(255,193,7,0.5)]" style={{ transform: `rotate(${i * 45}deg) translateY(-40px)` }} />
            ))}
          </motion.div>

          {/* 6. RIGHT LUMI MATERIALIZES (Ch 2 & 3) */}
          <motion.div 
            className="absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-end lg:justify-center pb-[10vh] lg:pb-0"
            style={{ opacity: lumiOpacity }}
          >
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center lg:h-full">
              <div className="hidden lg:block"></div>
              <div className="hidden lg:block"></div>
              
              <motion.div className="flex justify-center lg:justify-center items-center" style={{ scale: lumiScale, y: lumiY }}>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <img src="/lumi-spark.png" alt="Lumi Awakening" className="h-[25vh] sm:h-[30vh] lg:h-[40vh] w-auto object-contain drop-shadow-[0_0_15px_rgba(255,193,7,0.15)]" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* --- CH 4 POWERS INTERACTIVE CONSTELLATION --- */}
          <motion.div 
            className="absolute inset-0 flex-col items-center justify-center z-50 pointer-events-auto"
            style={{ opacity: ch4Opacity, display: ch4Display }}
            onClick={() => setActivePower(null)}
          >
            <div className="absolute top-[15%] flex justify-center w-full pointer-events-none">
              <div className="text-lumi-yellow/80 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold opacity-80 block">04 — The Powers</div>
            </div>

            <div className="relative w-full max-w-5xl h-[60vh] md:h-[70vh] flex items-center justify-center mt-12 md:mt-0">
              
              {/* Constellation Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block">
                {/* 0 -> Center */}
                <motion.line x1="50%" y1="10%" x2="50%" y2="50%" stroke={activePower === 0 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 0 ? 2 : 1} style={{ opacity: ch4Node1Opacity }} className="transition-all duration-500" />
                {/* 1 -> Center */}
                <motion.line x1="80%" y1="30%" x2="50%" y2="50%" stroke={activePower === 1 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 1 ? 2 : 1} style={{ opacity: ch4Node2Opacity }} className="transition-all duration-500" />
                {/* 2 -> Center */}
                <motion.line x1="75%" y1="80%" x2="50%" y2="50%" stroke={activePower === 2 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 2 ? 2 : 1} style={{ opacity: ch4Node3Opacity }} className="transition-all duration-500" />
                {/* 3 -> Center */}
                <motion.line x1="25%" y1="80%" x2="50%" y2="50%" stroke={activePower === 3 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 3 ? 2 : 1} style={{ opacity: ch4Node4Opacity }} className="transition-all duration-500" />
                {/* 4 -> Center */}
                <motion.line x1="20%" y1="30%" x2="50%" y2="50%" stroke={activePower === 4 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 4 ? 2 : 1} style={{ opacity: ch4Node5Opacity }} className="transition-all duration-500" />
              </svg>
              
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none md:hidden">
                <motion.line x1="50%" y1="0%" x2="50%" y2="50%" stroke={activePower === 0 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 0 ? 2 : 1} style={{ opacity: ch4Node1Opacity }} className="transition-all duration-500" />
                <motion.line x1="90%" y1="25%" x2="50%" y2="50%" stroke={activePower === 1 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 1 ? 2 : 1} style={{ opacity: ch4Node2Opacity }} className="transition-all duration-500" />
                <motion.line x1="85%" y1="85%" x2="50%" y2="50%" stroke={activePower === 2 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 2 ? 2 : 1} style={{ opacity: ch4Node3Opacity }} className="transition-all duration-500" />
                <motion.line x1="15%" y1="85%" x2="50%" y2="50%" stroke={activePower === 3 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 3 ? 2 : 1} style={{ opacity: ch4Node4Opacity }} className="transition-all duration-500" />
                <motion.line x1="10%" y1="25%" x2="50%" y2="50%" stroke={activePower === 4 ? "rgba(255,193,7,0.8)" : (activePower !== null ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.3)")} strokeWidth={activePower === 4 ? 2 : 1} style={{ opacity: ch4Node5Opacity }} className="transition-all duration-500" />
              </svg>

              {/* Center Lumi */}
              <motion.div 
                className="absolute z-30 flex items-center justify-center pointer-events-none"
                style={{ scale: ch4LumiScale }}
              >
                <motion.div
                  animate={{ y: activePower !== null ? [0, -15, 0] : [0, -10, 0] }}
                  transition={{ duration: activePower !== null ? 3 : 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative transition-all duration-700"
                >
                  <div className={`relative transition-all duration-700 ${activePower !== null ? 'drop-shadow-[0_0_30px_rgba(255,193,7,0.4)]' : 'drop-shadow-[0_0_10px_rgba(255,193,7,0.1)]'}`}>
                     <img src="/lumi-powers.png" alt="Lumi Powers" className="h-[25vh] sm:h-[35vh] md:h-[45vh] w-auto object-contain relative z-10" />
                     {/* Chest Star Glow overlay */}
                     <div className={`absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 z-20 mix-blend-screen ${activePower !== null ? 'w-20 h-20 bg-[radial-gradient(circle,rgba(255,193,7,0.6)_0%,transparent_70%)] opacity-100' : 'w-10 h-10 bg-[radial-gradient(circle,rgba(255,193,7,0)_0%,transparent_70%)] opacity-0'}`} />
                  </div>
                </motion.div>
              </motion.div>

              {/* Ability Nodes */}
              {powers.map((power, i) => {
                const nodeOpacities = [ch4Node1Opacity, ch4Node2Opacity, ch4Node3Opacity, ch4Node4Opacity, ch4Node5Opacity];
                const isActive = activePower === power.id;
                const isHoveredOrClicked = activePower !== null;
                const Icon = power.icon;
                
                return (
                  <motion.div
                    key={power.id}
                    className={`absolute flex items-center justify-center ${power.pos} -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer group`}
                    style={{ opacity: nodeOpacities[i] }}
                    onMouseEnter={() => setActivePower(power.id)}
                    onMouseLeave={() => setActivePower(null)}
                    onClick={(e) => { e.stopPropagation(); setActivePower(power.id); }}
                  >
                    {/* Expanding Energy Ring (Active state) */}
                    <div className={`absolute rounded-full border border-lumi-yellow transition-all duration-700 ease-out ${isActive ? 'w-24 h-24 opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]' : 'w-12 h-12 opacity-0'}`} />
                    
                    {/* Orbital Glow / Circular Background */}
                    <div className={`absolute rounded-full transition-all duration-500 ${isActive ? 'w-16 h-16 bg-lumi-yellow/20 shadow-[0_0_30px_rgba(255,193,7,0.6)]' : 'w-12 h-12 bg-lumi-yellow/5 border border-lumi-yellow/30 group-hover:bg-lumi-yellow/10 group-hover:border-lumi-yellow/50'}`} />

                    {/* Icon */}
                    <Icon className={`relative z-10 transition-all duration-500 ${isActive ? 'text-white w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' : (isHoveredOrClicked ? 'text-lumi-yellow/40 w-6 h-6' : 'text-lumi-yellow w-6 h-6')}`} strokeWidth={isActive ? 2 : 1.5} />

                    {/* Floating Dialogue Box */}
                    <div className={`absolute ${power.boxPos} w-[220px] md:w-[280px] p-4 md:p-5 rounded-xl border border-lumi-yellow/30 bg-[#020c1b]/95 backdrop-blur-md shadow-[0_0_30px_rgba(255,193,7,0.2)] transition-all duration-500 ease-out flex flex-col gap-2 ${isActive ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                      <h3 className="text-lumi-yellow text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">{power.title}</h3>
                      <p className="font-story text-sm md:text-base text-lumi-cream leading-snug">"{power.desc}"</p>
                    </div>
                  </motion.div>
                );
              })}

            </div>
          </motion.div>

          {/* --- CH 5 THE MISSION --- */}
          <motion.div 
            className="absolute inset-0 flex-col items-center justify-center z-50 pointer-events-auto"
            style={{ opacity: ch5Opacity, display: ch5Display }}
            onClick={() => setActiveMissionHover(null)}
          >
            <div className="absolute top-[5%] flex justify-center w-full pointer-events-none">
              <div className="text-lumi-yellow/80 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold opacity-80 block">05 — The Mission</div>
            </div>



            <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center mt-10">
              
              {/* SVG Path lines connecting the nodes */}
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden md:block">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.line 
                    key={"line" + i}
                    x1={nodeXs[i]} y1={desktopNodeYs[i] + "%"}
                    x2={nodeXs[i+1]} y2={desktopNodeYs[i+1] + "%"}
                    stroke="rgba(255,193,7,0.4)" 
                    strokeWidth="2"
                    className="transition-all duration-700"
                    style={{ opacity: activeMissionNode > i ? 1 : 0.15 }}
                  />
                ))}
              </svg>
              <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none md:hidden">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.line 
                    key={"m-line" + i}
                    x1={mNodeXs[i]} y1={mobileNodeYs[i] + "%"}
                    x2={mNodeXs[i+1]} y2={mobileNodeYs[i+1] + "%"}
                    stroke="rgba(255,193,7,0.4)" 
                    strokeWidth="2"
                    className="transition-all duration-700"
                    style={{ opacity: activeMissionNode > i ? 1 : 0.15 }}
                  />
                ))}
              </svg>

              {/* Nodes */}
              {desktopNodeLabels.map((label, i) => {
                const isActive = activeMissionNode >= i;
                const isCurrent = activeMissionNode === i;
                const nodeIcons = [AlertCircle, MessageCircle, Ear, Brain, Compass, Flag];
                const NodeIcon = nodeIcons[i];
                return (
                  <motion.div 
                    key={"node" + i}
                    className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ 
                      x: "-50%", y: "-50%",
                      left: window.innerWidth >= 768 ? nodeXs[i] : mNodeXs[i], 
                      top: window.innerWidth >= 768 ? desktopNodeYs[i] + "%" : mobileNodeYs[i] + "%" 
                    }}
                  >
                    {/* Node icon */}
                    <div className="relative flex items-center justify-center">
                       {/* Soft Pulse/Ripple (Active state only) */}
                       <div className={`absolute rounded-full transition-all duration-700 border ${isCurrent ? 'w-14 h-14 border-lumi-yellow/60 animate-[ping_3s_ease-out_infinite]' : 'w-10 h-10 border-transparent opacity-0'}`} />
                       
                       {/* Orbital Ring Background */}
                       <div className={`absolute rounded-full transition-all duration-700 border ${isCurrent ? 'w-14 h-14 border-lumi-yellow bg-lumi-yellow/10 shadow-[0_0_20px_rgba(255,193,7,0.4)]' : (isActive ? 'w-10 h-10 border-lumi-yellow/40 bg-lumi-yellow/5 shadow-[0_0_10px_rgba(255,193,7,0.1)]' : 'w-8 h-8 border-[#1a2b4c]/60 bg-[#060B19]/50')}`} />
                       
                       {/* Icon */}
                       <div className={`relative z-10 transition-all duration-500 flex items-center justify-center ${isCurrent ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110' : (isActive ? 'drop-shadow-[0_0_5px_rgba(255,193,7,0.4)]' : 'opacity-40')}`}>
                         <NodeIcon className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ${isCurrent ? 'text-white' : (isActive ? 'text-lumi-yellow' : 'text-[#4a5b7c]')}`} strokeWidth={isCurrent ? 2 : 1.5} />
                       </div>
                    </div>
                    {/* Label */}
                    <div className={`mt-5 font-bold tracking-widest text-[10px] md:text-xs uppercase transition-all duration-500 whitespace-nowrap ${isCurrent ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' : (isActive ? 'text-lumi-yellow' : 'text-[#4a5b7c]')}`}>
                      {label}
                    </div>
                  </motion.div>
                );
              })}

              {/* Lumi Floating along the path */}
              <motion.div 
                className="absolute z-40 flex items-center justify-center pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
                style={{
                  left: window.innerWidth >= 768 ? nodeXs[activeMissionNode] : mNodeXs[activeMissionNode],
                  top: window.innerWidth >= 768 ? desktopNodeYs[activeMissionNode] + "%" : mobileNodeYs[activeMissionNode] + "%",
                  scale: ch5LumiScale
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative transition-all duration-700 drop-shadow-[0_0_20px_rgba(255,193,7,0.4)]"
                >
                  <img src="/lumi-spark.png" alt="Lumi" className="h-[12vh] md:h-[18vh] w-auto object-contain relative z-10" />
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 z-20 mix-blend-screen w-12 h-12 bg-[radial-gradient(circle,rgba(255,193,7,0.6)_0%,transparent_70%)] opacity-100 animate-pulse" />
                </motion.div>
              </motion.div>

              {/* Right Side Message */}
              <motion.div 
                className="absolute flex flex-col items-center lg:items-start justify-center pointer-events-none z-0 w-full lg:w-auto"
                style={{ 
                  right: window.innerWidth >= 1024 ? "5%" : "auto", 
                  left: window.innerWidth >= 1024 ? "auto" : "50%",
                  top: window.innerWidth >= 1024 ? "50%" : "auto", 
                  bottom: window.innerWidth >= 1024 ? "auto" : "-10%",
                  x: window.innerWidth >= 1024 ? "0%" : "-50%",
                  translateY: window.innerWidth >= 1024 ? "-50%" : "0%",
                  opacity: rightTextOpacity 
                }}
              >
                <div className="relative p-2 lg:p-6 scale-[0.6] md:scale-75 lg:scale-100">
                  {/* Orbital line behind text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] border-[1px] border-lumi-yellow/20 rounded-[50%] -rotate-[10deg] shadow-[0_0_15px_rgba(255,193,7,0.05)] opacity-60 hidden lg:block">
                    <div className="absolute top-1/2 -right-1.5 w-2 h-2 bg-lumi-yellow rounded-full shadow-[0_0_10px_rgba(255,193,7,0.8)]" />
                  </div>
                  <h3 className="font-story text-2xl md:text-3xl lg:text-4xl text-lumi-cream leading-snug text-center lg:text-left max-w-[280px] drop-shadow-xl relative z-10">
                    Every problem <span className="italic text-white font-light">is a step closer</span><br/>
                    to a <span className="text-lumi-yellow drop-shadow-[0_0_15px_rgba(255,193,7,0.6)] font-semibold">brighter tomorrow.</span>
                  </h3>
                </div>
              </motion.div>

              </div>
            </motion.div>

          {/* --- FIXED TEXT LAYERS (Ch 1 - 3) --- */}
          
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-4 pointer-events-none" style={{ opacity: introOpacity, y: introY }}>
            <h2 className="font-sans text-xs md:text-sm text-lumi-cream/60 uppercase tracking-[0.4em] mb-6 text-center">Every hero has a beginning.</h2>
            <h1 className="font-handwritten text-5xl md:text-7xl text-lumi-yellow text-center leading-tight">This one began with a signal.</h1>
          </motion.div>

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-40 px-4 pointer-events-none" style={{ opacity: ch1TextOpacity, y: ch1TextY }}>
            <div className="text-lumi-yellow/80 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold mb-6">01 — The Signal</div>
            <p className="font-story text-xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-lumi-cream text-balance max-w-2xl text-center">
              Somewhere beyond the noise of the universe, a little signal was searching for someone who needed to be heard.
            </p>
          </motion.div>

          <motion.div className="absolute inset-0 flex flex-col items-center justify-start lg:justify-center z-40 pt-[12vh] lg:pt-0 pointer-events-none">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center lg:h-full">
              <div className="hidden lg:block"></div>
              
              <div className="flex flex-col justify-center items-center text-center relative h-[30vh] lg:h-[40vh] w-full">
                <motion.div className="absolute top-0 left-0 right-0 flex justify-center" style={{ opacity: ch2HeaderOpacity }}>
                  <div className="text-lumi-yellow/80 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold mb-4 lg:mb-6 opacity-80 block">02 — The Spark</div>
                </motion.div>

                <motion.div style={{ opacity: ch2Text1Opacity, y: ch2Text1Y }} className="absolute inset-0 flex flex-col items-center justify-center w-full">
                  <p className="font-story text-xl md:text-3xl lg:text-4xl font-medium leading-tight text-lumi-cream/90 text-balance px-2 md:px-4">
                    A little guardian made not to fight the darkness... but to listen.
                  </p>
                </motion.div>
                
                <motion.div style={{ opacity: ch2Text2Opacity, y: ch2Text2Y }} className="absolute inset-0 flex flex-col items-center justify-center w-full">
                  <p className="font-story text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight text-lumi-cream text-balance">
                    And from that signal came Lumi.
                  </p>
                </motion.div>
              </div>
              
              <div className="hidden lg:block"></div>
            </div>
          </motion.div>

          <motion.div className="absolute inset-0 flex flex-col items-center justify-start lg:justify-center z-40 pt-[12vh] lg:pt-0 pointer-events-none">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center lg:h-full">
              <div className="hidden lg:block"></div>
              
              <div className="flex flex-col justify-center items-center text-center relative h-[30vh] lg:h-[40vh] w-full">
                <motion.div style={{ opacity: cityOpacity }} className="absolute top-0 left-0 right-0 flex justify-center">
                  <div className="text-lumi-yellow/80 tracking-[0.3em] uppercase text-[10px] md:text-xs font-bold mb-4 lg:mb-6 opacity-80 block">03 — The Discovery</div>
                </motion.div>

                <motion.div style={{ opacity: ch3Text1Opacity, y: ch3Text1Y }} className="absolute inset-0 flex flex-col items-center justify-center w-full">
                  <p className="font-story text-xl md:text-2xl lg:text-3xl font-semibold leading-tight text-lumi-cream text-balance">
                    Lumi discovered something.
                  </p>
                </motion.div>

                <motion.div style={{ opacity: ch3Text2Opacity, y: ch3Text2Y }} className="absolute inset-0 flex flex-col items-center justify-center w-full">
                  <p className="font-story text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight text-lumi-cream text-balance">
                    Not every problem needs a superhero.
                  </p>
                </motion.div>

                <motion.div style={{ opacity: ch3Text3Opacity, y: ch3Text3Y }} className="absolute inset-0 flex flex-col items-center justify-center w-full">
                  <p className="font-story text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-lumi-yellow text-balance drop-shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                    Sometimes... people just need someone to listen.
                  </p>
                </motion.div>
              </div>
              
              <div className="hidden lg:block"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default OurStory;
