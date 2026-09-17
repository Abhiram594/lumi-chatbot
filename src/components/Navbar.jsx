import React, { useState } from 'react';
import { Star, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const currentHash = window.location.hash || '#/';

  const navLinks = [
    { name: 'Home', href: '#/', active: currentHash === '#/' || currentHash === '' },
    { name: 'Talk to Lumi', href: '#/talk' },
    { name: 'Our Story', href: '#/our-story', active: currentHash === '#/our-story' },
    { name: 'How It Works', href: '#/how-it-works' },
    { name: 'Resources', href: '#/resources' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-lumi-navy/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-lumi-yellow rounded-md p-1">
            <Star className="text-lumi-yellow w-6 h-6 fill-current" />
            <span className="font-handwritten text-3xl text-lumi-cream tracking-wide">LUMI</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-lumi-yellow focus:outline-none focus:ring-2 focus:ring-lumi-yellow rounded-sm px-1 py-0.5 ${
                  link.active ? 'text-lumi-yellow border-b-2 border-lumi-yellow pb-1' : 'text-lumi-cream/80'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex">
            <button 
              onClick={() => window.location.hash = '#/talk'}
              className="bg-lumi-yellow hover:bg-lumi-yellow-hover text-lumi-midnight font-semibold py-2 px-5 rounded-full flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lumi-navy"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Lumi →</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-lumi-cream hover:text-lumi-yellow focus:outline-none focus:ring-2 focus:ring-lumi-yellow rounded-md p-1"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-lumi-navy/95 backdrop-blur-lg border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-lumi-yellow ${
                    link.active ? 'text-lumi-yellow bg-white/5' : 'text-lumi-cream/80 hover:text-lumi-yellow hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    window.location.hash = '#/talk';
                  }}
                  className="w-full bg-lumi-yellow hover:bg-lumi-yellow-hover text-lumi-midnight font-semibold py-3 px-5 rounded-full flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-lumi-navy"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Talk to Lumi →</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
