
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import FloatingEmojis from './components/FloatingEmojis';
import LoveLines from './components/LoveLines';
import SideMenu from './components/SideMenu';
import Slideshow from './components/Slideshow';
import LoveStreaming from './components/LoveStreaming';
import bgImage from './background.jpeg';

const App: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [showStreaming, setShowStreaming] = useState(false);

  // Handle menu selection
  const handleMenuSelect = (id: string) => {
    if (id === 'slideshow') {
      setShowSlideshow(true);
    } else if (id === 'streaming') {
      setShowStreaming(true);
    }
  };

  useEffect(() => {
    // Sequence the animations
    const timers = [
      setTimeout(() => setStage(1), 1000),  // Names pop up
      setTimeout(() => setStage(2), 3500),  // Love lines appear
      setTimeout(() => setStage(3), 8500),  // Final message
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0"
        style={{
          // Use the imported local image
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </motion.div>

      {/* Floating Emojis Layer */}
      <FloatingEmojis />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center text-white">

        {/* Stage 1: Names Pop-up */}
        <AnimatePresence>
          {stage >= 1 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mb-12">
              <motion.h2
                initial={{ scale: 0, rotate: -20, opacity: 0 }}
                animate={{ scale: 1.2, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="text-6xl md:text-8xl font-romantic text-rose-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
              >
                Sachin
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" />
              </motion.div>

              <motion.h2
                initial={{ scale: 0, rotate: 20, opacity: 0 }}
                animate={{ scale: 1.2, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.8 }}
                className="text-6xl md:text-8xl font-romantic text-rose-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
              >
                Priyanka
              </motion.h2>
            </div>
          )}
        </AnimatePresence>

        {/* Stage 2: Love Lines */}
        <div className="h-32 mb-8">
          {stage >= 2 && <LoveLines />}
        </div>

        {/* Stage 3: Big Final Message */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  filter: ["drop-shadow(0 0 0px #f43f5e)", "drop-shadow(0 0 20px #f43f5e)", "drop-shadow(0 0 0px #f43f5e)"]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl"
              >
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
                  Sachin <span className="text-rose-500">Loves</span> Priyanka
                </h1>
                <motion.div
                  className="flex justify-center mt-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-xl" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Side Menu */}
      <SideMenu onSelect={handleMenuSelect} />

      {/* Slideshow Overlay */}
      <AnimatePresence>
        {showSlideshow && <Slideshow onClose={() => setShowSlideshow(false)} />}
      </AnimatePresence>


      {/* Love in Motion Overlay */}
      <AnimatePresence>
        {stage >= 0 && /* Just ensuring it has access to context if needed, though independent */ null}
        {showStreaming && <LoveStreaming onClose={() => setShowStreaming(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
