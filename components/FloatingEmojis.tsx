
import React, { useEffect, useState } from 'react';

const EMOJIS = ['❤️', '💖', '💕', '💗', '💓', '🥰', '🌹', '✨'];

interface Particle {
  id: number;
  x: string;
  emoji: string;
  duration: number;
  delay: number;
  size: number;
}

const FloatingEmojis: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      duration: 5 + Math.random() * 10,
      delay: Math.random() * 10,
      size: 15 + Math.random() * 30,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <div
          key={p.id}
          className="emoji-particle opacity-0"
          style={{
            left: p.x,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingEmojis;
