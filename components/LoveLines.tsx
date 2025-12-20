
import React from 'react';
import { motion } from 'framer-motion';

const lines = [
  "In the quiet of the night, I find you in my dreams...",
  "In every beat of my heart, your name echoes...",
  "Our love is a journey with no end, only beautiful horizons.",
  "You are my today, and all of my tomorrows."
];

const LoveLines: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 1.5,
            duration: 1,
          }}
          className="text-lg md:text-2xl italic font-light text-rose-100/90 drop-shadow-sm font-script"
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
};

export default LoveLines;
