import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CursorGlow from './components/CursorGlow';
import TheSignalIntro from './components/TheSignalIntro';

// Lazy load heavy page components for better performance
const Home = lazy(() => import('./pages/Home'));
const OurStory = lazy(() => import('./pages/OurStory'));
const TalkToLumi = lazy(() => import('./pages/TalkToLumi'));

// Simple loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-lumi-navy">
    <div className="w-8 h-8 border-2 border-lumi-yellow border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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

  return (
    <div className="min-h-screen bg-lumi-navy text-lumi-cream font-sans overflow-x-hidden">
      <CursorGlow />
      <TheSignalIntro />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </div>
  );
}

export default App;

