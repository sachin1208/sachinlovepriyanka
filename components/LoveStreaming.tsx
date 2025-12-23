import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info, Pause, ArrowLeft, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import Hls from 'hls.js';

import { Heart } from 'lucide-react';

interface LoveStreamingProps {
    onClose: () => void;
}

const LoveStreaming: React.FC<LoveStreamingProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const heroVideoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const heroHlsRef = useRef<Hls | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Asset paths (public folder)
    const video1Hls = "/Videos/journey/index.m3u8";
    const video2Hls = "/Videos/forever/index.m3u8";
    const thumb1 = "/Videos/thumbnail_journey.png";
    const thumb2 = "/Videos/thumbnail_forever.png";

    // Initial Loading Animation Timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000); // 3 seconds intro
        return () => clearTimeout(timer);
    }, []);

    // HLS Initialization for Hero Video
    useEffect(() => {
        if (!loading && heroVideoRef.current) {
            const video = heroVideoRef.current;
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(video1Hls);
                hls.attachMedia(video);
                heroHlsRef.current = hls;
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = video1Hls;
            }
        }
        return () => {
            if (heroHlsRef.current) {
                heroHlsRef.current.destroy();
                heroHlsRef.current = null;
            }
        };
    }, [loading]);

    // HLS Initialization for Selected Video
    useEffect(() => {
        if (selectedVideo && videoRef.current) {
            const video = videoRef.current;

            // Cleanup previous HLS instance
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(selectedVideo);
                hls.attachMedia(video);
                hlsRef.current = hls;
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => setIsPlaying(false));
                    setIsPlaying(true);
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = selectedVideo;
                video.play().catch(() => setIsPlaying(false));
                setIsPlaying(true);
            }
        }
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [selectedVideo]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    useEffect(() => {
        if (selectedVideo) {
            handleMouseMove();
            return () => {
                if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            };
        }
    }, [selectedVideo, isPlaying]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(parseFloat(e.target.value));
        }
    };

    const videos = [
        {
            id: 1,
            src: video1Hls,
            title: "Our Beautiful Journey",
            thumbnail: thumb1,
            duration: "Memorable"
        },
        {
            id: 2,
            src: video2Hls,
            title: "Forever & Always",
            thumbnail: thumb2,
            duration: "Eternal"
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
                                ref={heroVideoRef}
                                autoPlay
                                loop
                                m3u8-loop="true"
                                muted
                                playsInline
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
                                    <span className="text-white/60 border border-white/40 px-1 text-sm">HD</span>
                                    <span className="text-white">2 Videos</span>
                                </div>
                                <p className="text-lg text-white/90 drop-shadow-md line-clamp-3">
                                    A timeless romance capturing the beautiful moments of two souls intertwined by destiny. Watch their journey unfold in this exclusive special feature.
                                </p>
                            </motion.div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setSelectedVideo(video1Hls);
                                        setIsPlaying(true);
                                    }}
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
                            {videos.map((video) => (
                                <motion.div
                                    key={video.id}
                                    whileHover={{ scale: 1.05, zIndex: 20 }}
                                    className="bg-[#2f2f2f] rounded-md overflow-hidden cursor-pointer group relative aspect-video"
                                    onClick={() => {
                                        setSelectedVideo(video.src);
                                        setIsPlaying(true);
                                    }}
                                >
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        loading="lazy"
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
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Full-Screen Immersive Video Player */}
                    <AnimatePresence>
                        {selectedVideo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                onMouseMove={handleMouseMove}
                                className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden"
                            >
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted={isMuted}
                                    onTimeUpdate={handleTimeUpdate}
                                    onClick={togglePlay}
                                    className="w-full h-full object-contain"
                                />

                                <AnimatePresence>
                                    {!isPlaying && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.5 }}
                                            className="absolute pointer-events-none"
                                        >
                                            <div className="bg-black/40 p-8 rounded-full backdrop-blur-md">
                                                <Play size={100} className="text-white fill-white" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    animate={{ opacity: showControls ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none select-none"
                                >
                                    <div className="flex items-start">
                                        <button
                                            onClick={() => setSelectedVideo(null)}
                                            className="pointer-events-auto flex items-center gap-2 group"
                                        >
                                            <div className="p-3 rounded-full hover:bg-white/20 transition-all group-hover:scale-110">
                                                <ArrowLeft size={32} />
                                            </div>
                                            <span className="text-xl font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">Back to Love Stream</span>
                                        </button>
                                    </div>

                                    <div className="space-y-6 md:space-y-8 pointer-events-auto">
                                        <div className="relative group w-full flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={progress}
                                                onChange={handleSeek}
                                                className="w-full h-1 md:h-2 accent-[#E50914] bg-white/30 rounded-full appearance-none cursor-pointer hover:h-4 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-8 md:gap-12">
                                                <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                                                    {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" />}
                                                </button>
                                                <button onClick={() => {
                                                    if (videoRef.current) videoRef.current.currentTime -= 10;
                                                }} className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                                                    <RotateCcw size={32} />
                                                </button>
                                                <button onClick={() => setIsMuted(!isMuted)} className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                                                    {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
                                                </button>
                                            </div>
                                            <div className="hidden md:block text-2xl font-bold text-white/90 italic tracking-widest uppercase">
                                                Forever Love • In Motion
                                            </div>
                                            <div>
                                                <button className="hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                                                    <Maximize size={32} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </motion.div>
    );
};

export default LoveStreaming;
