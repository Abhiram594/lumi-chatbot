import React from 'react';
import { MessageCircle, Heart, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'You Can Talk Here.',
    description: 'No matter how big or small, your words have a place.',
    icon: MessageCircle,
  },
  {
    name: "Lumi Won't Judge.",
    description: "Just tell me what's on your mind. I'll listen.",
    icon: Heart,
  },
  {
    name: "Let's Find a Way.",
    description: "You don't have to figure everything out alone.",
    icon: Compass,
  },
  {
    name: 'One Step at a Time.',
    description: 'Small steps can still lead to brighter days.',
    icon: Sparkles,
  },
];

const stars = [
  { top: '10%', left: '15%', size: 2, delay: '0s', color: 'bg-white' },
  { top: '25%', left: '5%', size: 1.5, delay: '1s', color: 'bg-lumi-yellow' },
  { top: '15%', left: '85%', size: 3, delay: '0.5s', color: 'bg-white' },
  { top: '40%', left: '92%', size: 1, delay: '2s', color: 'bg-white/70' },
  { top: '65%', left: '12%', size: 2, delay: '1.5s', color: 'bg-lumi-yellow' },
  { top: '80%', left: '5%', size: 1.5, delay: '3s', color: 'bg-white' },
  { top: '85%', left: '90%', size: 2, delay: '2.5s', color: 'bg-white' },
  { top: '55%', left: '80%', size: 1, delay: '0.8s', color: 'bg-lumi-yellow' },
  { top: '30%', left: '30%', size: 1, delay: '1.2s', color: 'bg-white/50' },
  { top: '75%', left: '40%', size: 2, delay: '3.5s', color: 'bg-white/80' },
  { top: '20%', left: '50%', size: 1.5, delay: '0.2s', color: 'bg-lumi-yellow' },
  { top: '90%', left: '60%', size: 1, delay: '1.8s', color: 'bg-white/60' },
  { top: '12%', left: '70%', size: 2, delay: '2.2s', color: 'bg-lumi-yellow/80' },
  { top: '60%', left: '25%', size: 1.5, delay: '1.7s', color: 'bg-white/90' },
  { top: '45%', left: '10%', size: 1, delay: '0.3s', color: 'bg-lumi-yellow' },
  { top: '95%', left: '20%', size: 2, delay: '4s', color: 'bg-white/40' },
  { top: '5%', left: '40%', size: 1, delay: '2.8s', color: 'bg-white' },
  { top: '35%', left: '65%', size: 1.5, delay: '0.7s', color: 'bg-lumi-yellow' },
  { top: '70%', left: '70%', size: 2, delay: '1.1s', color: 'bg-white' },
  { top: '50%', left: '95%', size: 1, delay: '3.2s', color: 'bg-lumi-yellow' },
];

const glowingDust = [
  { top: '15%', left: '20%', size: 6 },
  { top: '40%', left: '8%', size: 4 },
  { top: '25%', left: '85%', size: 8 },
  { top: '60%', left: '90%', size: 5 },
  { top: '75%', left: '15%', size: 7 },
  { top: '85%', left: '80%', size: 6 },
  { top: '35%', left: '45%', size: 5 },
  { top: '65%', left: '55%', size: 4 },
];

const FeatureStrip = () => {
  return (
    <section className="bg-lumi-midnight pt-16 pb-24 relative z-20 overflow-hidden">
      
      {/* Decorative cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Noise overlay for cinematic texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Nebula Layer 1: Deep cosmic blue/indigo clouds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(30,58,138,0.2)_0%,_rgba(10,25,47,0)_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(49,46,129,0.2)_0%,_rgba(10,25,47,0)_60%)]"></div>
        
        {/* Nebula Layer 2: Subtle Golden / Cosmic glows */}
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-lumi-yellow/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-[#FFCA28]/10 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[30%] right-[-5%] w-[30%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
        
        {/* Subtle center darkness to keep cards readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,25,47,0.4)_0%,_rgba(10,25,47,0)_100%)]"></div>

        {/* Scattered Stars */}
        <div className="absolute inset-0">
          {stars.map((star, i) => (
            <div 
              key={`star-${i}`}
              className={`absolute rounded-full animate-twinkle ${star.color}`}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
              }}
            />
          ))}
        </div>

        {/* Distant soft glowing stars */}
        <div className="absolute top-[15%] left-[25%] w-1.5 h-1.5 bg-lumi-yellow/80 rounded-full blur-[1px] shadow-[0_0_15px_3px_rgba(255,202,40,0.4)] animate-pulse"></div>
        <div className="absolute top-[75%] right-[20%] w-2 h-2 bg-blue-300/80 rounded-full blur-[1px] shadow-[0_0_20px_4px_rgba(147,197,253,0.3)] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 bg-white/80 rounded-full blur-[1px] shadow-[0_0_15px_3px_rgba(255,255,255,0.4)] animate-pulse" style={{ animationDelay: '0.8s' }}></div>

        {/* Slow drifting cosmic dust */}
        <motion.div 
          className="absolute inset-0"
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {glowingDust.map((dust, i) => (
            <div 
              key={`dust-${i}`}
              className="absolute rounded-full bg-lumi-yellow/20 blur-[2px]"
              style={{
                top: dust.top,
                left: dust.left,
                width: `${dust.size}px`,
                height: `${dust.size}px`,
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <h2 className="font-handwritten text-4xl md:text-5xl text-lumi-yellow mb-4 drop-shadow-sm">
            Whenever you need a little light...
          </h2>
          <p className="text-lg text-lumi-cream/80 font-medium">
            Lumi is here to listen, understand, and help you take the next step.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-[#0A192F]/40 backdrop-blur-md border border-white/10 hover:border-lumi-yellow/40 hover:bg-[#0A192F]/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(255,193,7,0.15)] overflow-hidden"
            >
              {/* Card internal subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-lumi-yellow/0 to-lumi-yellow/0 group-hover:from-lumi-yellow/5 transition-colors duration-500 rounded-3xl pointer-events-none"></div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#0d2140] flex items-center justify-center mb-6 shadow-inner border border-white/5 text-lumi-yellow group-hover:scale-110 group-hover:text-white transition-transform duration-500 ease-out relative">
                <div className="absolute inset-0 rounded-2xl bg-lumi-yellow/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <feature.icon className="w-8 h-8 relative z-10" />
              </div>
              
              <h3 className="text-xl font-bold text-lumi-cream mb-3 group-hover:text-white transition-colors">{feature.name}</h3>
              <p className="text-lumi-cream/70 font-medium leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
