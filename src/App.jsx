import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import OurStory from './pages/OurStory';
import TalkToLumi from './pages/TalkToLumi';
import Powers from './pages/Powers';
import CursorGlow from './components/CursorGlow';
import TheSignalIntro from './components/TheSignalIntro';

function App() {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Force home on initial page load / refresh
    if (window.location.hash !== '') {
      window.history.replaceState(null, null, window.location.pathname);
    }
    
    const handleHashChange = () => setCurrentPath(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isOurStory = currentPath === '#/our-story';
  const isTalk = currentPath === '#/talk';
  const isPowers = currentPath === '#/powers';

  return (
    <div className="min-h-screen bg-lumi-navy text-lumi-cream font-sans">
      <CursorGlow />
      <TheSignalIntro />
      <AnimatePresence mode="wait">
        {isOurStory ? (
          <motion.div
            key="our-story"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <OurStory />
          </motion.div>
        ) : isPowers ? (
          <motion.div
            key="powers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Powers />
          </motion.div>
        ) : isTalk ? (
          <motion.div
            key="talk"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TalkToLumi />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Home />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

