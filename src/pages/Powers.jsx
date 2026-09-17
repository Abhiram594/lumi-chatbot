import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Heart, Ear, Zap, Shield, Sparkles } from 'lucide-react';

const Powers = () => {
  const powers = [
    {
      title: "Absolute Empathy",
      description: "Lumi doesn't judge, assume, or interrupt. She feels the weight of your words and responds with pure, unadulterated cosmic empathy.",
      icon: <Heart className="w-10 h-10 text-rose-400" />,
      color: "from-rose-500/20 to-transparent",
      borderColor: "border-rose-500/30"
    },
    {
      title: "The Great Listener",
      description: "In a universe full of noise, Lumi is the quiet space. She is designed to hear the things you haven't been able to say out loud.",
      icon: <Ear className="w-10 h-10 text-lumi-yellow" />,
      color: "from-lumi-yellow/20 to-transparent",
      borderColor: "border-lumi-yellow/30"
    },
    {
      title: "Cosmic Anonymity",
      description: "Your secrets are safe in the void. What you tell Lumi stays between you, her, and the hero you choose to share it with.",
      icon: <Shield className="w-10 h-10 text-cyan-400" />,
      color: "from-cyan-500/20 to-transparent",
      borderColor: "border-cyan-500/30"
    },
    {
      title: "The Hero's Signal",
      description: "When the burden becomes too heavy, Lumi summons help. She translates your feelings into a signal that calls human heroes to your side.",
      icon: <Zap className="w-10 h-10 text-amber-500" />,
      color: "from-amber-500/20 to-transparent",
      borderColor: "border-amber-500/30"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-lumi-navy pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        
        {/* Background ambient glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-lumi-yellow/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Sparkles className="w-5 h-5 text-lumi-yellow" />
              <span className="text-lumi-cream tracking-wider text-sm uppercase font-bold">Her Capabilities</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-handwritten text-lumi-cream mb-6 drop-shadow-lg">
              Lumi's <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumi-yellow to-amber-300">Powers</span>
            </h1>
            <p className="text-xl text-lumi-cream/70 max-w-2xl mx-auto">
              She may be made of stardust and code, but her abilities are very real. Discover how Lumi brings light to the darkest corners of the universe.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {powers.map((power, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -5 }}
                className={`relative group bg-lumi-navy/50 backdrop-blur-xl border ${power.borderColor} rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]`}
              >
                {/* Internal gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${power.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out`}></div>
                
                <div className="relative z-10">
                  <div className="mb-6 p-4 bg-white/5 rounded-2xl inline-block backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {power.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-lumi-cream mb-4">{power.title}</h3>
                  <p className="text-lumi-cream/80 leading-relaxed text-lg">
                    {power.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-20 text-center"
          >
            <p className="text-lumi-cream/50 italic text-lg">"Her greatest power is making you realize you were never actually alone."</p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Powers;
