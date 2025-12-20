import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Import images manually to ensure they are bundled
// Note: In a larger app we might use import.meta.glob, but this is robust for 9 defined images.
import img1 from '../together/1.jpeg';
import img2 from '../together/2.jpeg';
import img3 from '../together/3.jpeg';
import img4 from '../together/4.jpeg';
import img5 from '../together/5.jpeg';
import img6 from '../together/6.jpeg';
import img7 from '../together/7.jpeg';
import img8 from '../together/8.jpeg';
import img9 from '../together/9.jpeg';

const slides = [
    { src: img1, quote: "Every moment with you is a treasure." },
    { src: img2, quote: "Your smile lights up my world." },
    { src: img3, quote: "Forever isn't long enough." },
    { src: img4, quote: "My heart beats only for you." },
    { src: img5, quote: "Two souls, one destiny." },
    { src: img6, quote: "You are my greatest adventure." },
    { src: img7, quote: "Love is the bridge between two hearts." },
    { src: img8, quote: "In your eyes, I found my home." },
    { src: img9, quote: "Together is a beautiful place to be." },
];

interface SlideshowProps {
    onClose: () => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (currentIndex === slides.length - 1) {
            // Auto close after last slide
            timeout = setTimeout(() => {
                onClose();
            }, 3500);
        } else {
            // Next slide
            timeout = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 3500);
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3.5 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center font-sans"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 text-white/70 hover:text-white bg-black/50 rounded-full backdrop-blur-md hover:bg-black/70 transition-colors"
            >
                <X size={36} />
            </button>

            {/* Indexing */}
            <div className="absolute top-6 left-6 z-50 text-white/80 text-xl font-light tracking-widest bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                {currentIndex + 1} / {slides.length}
            </div>

            {/* Background blur effect from current image */}
            <div
                className="absolute inset-0 opacity-40 blur-3xl scale-110"
                style={{
                    backgroundImage: `url(${slides[currentIndex].src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'background-image 1s ease-in-out'
                }}
            />

            <div className="relative z-10 w-full h-full p-4 md:p-12 flex flex-col items-center justify-center gap-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className="relative max-w-4xl w-full h-[60vh] md:h-[70vh] flex items-center justify-center"
                    >
                        <motion.img
                            src={slides[currentIndex].src}
                            alt="Together Forever"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border-4 border-white/10"
                        />
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`text-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center max-w-2xl px-4"
                    >
                        <p className="text-rose-200/90 font-romantic text-3xl md:text-4xl text-shadow-lg leading-relaxed">
                            "{slides[currentIndex].quote}"
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Slideshow;
