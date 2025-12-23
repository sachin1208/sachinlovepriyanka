import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info } from 'lucide-react';

// Import videos
import video1 from '../Videos/IMG_3738.MOV';
import video2 from '../Videos/IMG_4242.MP4';

import { Heart } from 'lucide-react';

interface LoveStreamingProps {
    onClose: () => void;
}

const LoveStreaming: React.FC<LoveStreamingProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Initial Loading Animation Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 seconds intro
        return () => clearTimeout(timer);
    }, []);

    const videos = [
        {
            id: 1,
            src: video1,
            title: "Our Beautiful Journey",
            thumbnail: video1, // Using video as thumb for now
            duration: "Memorable",
            match: "98% Match"
        },
        {
            id: 2,
            src: video2,
            title: "Forever & Always",
            thumbnail: video2,
            duration: "Eternal",
            match: "100% Match"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#141414] text-white overflow-y-auto font-sans"
        >
            {loading ? (
                // Netflix-style Loading Intro
                <div className="flex items-center justify-center h-full w-full bg-black">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow-2xl">
                            FOREVER
                        </h1>
                    </motion.div>
                </div>
            ) : (
                // Main Content
                <>
                    {/* Header */}
                    <div className="fixed top-0 w-full z-40 p-4 md:px-12 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center transition-all duration-300">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#E50914] tracking-tight">FOREVER</h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {/* Hero Section */}
                    <div className="relative w-full h-[60vh] md:h-[80vh]">
                        <div className="absolute inset-0">
                            <video
                                src={video1}
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
                        </div>

                        <div className="absolute bottom-12 md:bottom-24 left-4 md:left-12 max-w-lg space-y-4">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-5xl md:text-7xl font-bold mb-2">Sachin <Heart className="w-12 h-12 text-rose-500 fill-rose-500 animate-pulse" /> Priyanka</h1>
                                <div className="flex items-center gap-3 text-green-400 font-semibold mb-4">
                                    <span>99% Match</span>
                                    <span className="text-white/60 border border-white/40 px-1 text-sm">HD</span>
                                    <span className="text-white">2 Seasons</span>
                                </div>
                                <p className="text-lg text-white/90 drop-shadow-md line-clamp-3">
                                    A timeless romance capturing the beautiful moments of two souls intertwined by destiny. Watch their journey unfold in this exclusive special feature.
                                </p>
                            </motion.div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedVideo(video1)}
                                    className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-white/90 transition-colors"
                                >
                                    <Play fill="black" size={24} /> Play
                                </button>
                                <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/50 transition-colors">
                                    <Info size={24} /> More Info
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Section */}
                    <div className="px-4 md:px-12 -mt-10 md:-mt-20 relative z-10 pb-20">
                        <h3 className="text-xl font-semibold mb-4 text-white/90">Trending Now</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {videos.map((video, idx) => (
                                <motion.div
                                    key={video.id}
                                    whileHover={{ scale: 1.05, zIndex: 20 }}
                                    className="bg-[#2f2f2f] rounded-md overflow-hidden cursor-pointer group relative aspect-video"
                                    onClick={() => setSelectedVideo(video.src)}
                                >
                                    <video
                                        src={video.src}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />

                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-2 mb-2">
                                            <div className="bg-white rounded-full p-1.5 hover:bg-gray-200">
                                                <Play fill="black" size={12} className="text-black" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-sm">{video.title}</h4>
                                        <p className="text-green-400 text-xs font-semibold">{video.match}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Video Modal */}
                    <AnimatePresence>
                        {selectedVideo && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 backdrop-blur-xl"
                            >
                                <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden border border-white/10">
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full text-white hover:bg-white hover:text-black transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                    <video
                                        src={selectedVideo}
                                        controls
                                        autoPlay
                                        className="w-full h-full"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );
};

export default LoveStreaming;
