import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Info, Pause, ArrowLeft, Volume2, VolumeX, Maximize, RotateCcw, Heart } from 'lucide-react';
import Hls from 'hls.js';

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
    const backgroundVideoRef = useRef<HTMLVideoElement>(null);
    const hlsRefs = useRef<{ main: Hls | null; hero: Hls | null; bg: Hls | null }>({ main: null, hero: null, bg: null });
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Asset paths (public folder)
    const video1Hls = "/Videos/journey/index.m3u8";
    const video2Hls = "/Videos/forever/index.m3u8";
    const thumb1 = "/Videos/thumbnail_journey.png";
    const thumb2 = "/Videos/thumbnail_forever.png";

    // Initial Loading Animation Timer
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    // HLS Helper
    const setupHls = (src: string, target: HTMLVideoElement, key: keyof typeof hlsRefs.current) => {
        if (hlsRefs.current[key]) {
            hlsRefs.current[key]?.destroy();
            hlsRefs.current[key] = null;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(target);
            hlsRefs.current[key] = hls;
            if (key === 'main') {
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    target.play().catch(() => setIsPlaying(false));
                    setIsPlaying(true);
                });
            }
        } else if (target.canPlayType('application/vnd.apple.mpegurl')) {
            target.src = src;
        }
    };

    // Hero HLS
    useEffect(() => {
        if (!loading && heroVideoRef.current) {
            setupHls(video1Hls, heroVideoRef.current, 'hero');
        }
        return () => hlsRefs.current.hero?.destroy();
    }, [loading]);

    // Main Player HLS (Sync Primary + Background)
    useEffect(() => {
        if (selectedVideo && videoRef.current) {
            setupHls(selectedVideo, videoRef.current, 'main');
            if (backgroundVideoRef.current) {
                setupHls(selectedVideo, backgroundVideoRef.current, 'bg');
            }
        }
        return () => {
            hlsRefs.current.main?.destroy();
            hlsRefs.current.bg?.destroy();
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
                backgroundVideoRef.current?.pause();
            } else {
                videoRef.current.play();
                backgroundVideoRef.current?.play();
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
        const val = parseFloat(e.target.value);
        if (videoRef.current) {
            const time = (val / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            if (backgroundVideoRef.current) backgroundVideoRef.current.currentTime = time;
            setProgress(val);
        }
    };

    const videos = [
        { id: 1, src: video1Hls, title: "Our Beautiful Journey", thumbnail: thumb1 },
        { id: 2, src: video2Hls, title: "Forever & Always", thumbnail: thumb2 }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#141414] text-white overflow-y-auto font-sans"
        >
            <AnimatePresence>
                {loading ? (
                    <motion.div
                        key="loader"
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 flex items-center justify-center bg-black z-[100]"
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#E50914] uppercase drop-shadow-2xl">
                            FOREVER
                        </h1>
                    </motion.div>
                ) : (
                    <div className="relative min-h-screen">
                        {/* Header */}
                        <div className="fixed top-0 w-full z-40 p-4 md:px-12 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#E50914] tracking-tight">FOREVER</h1>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button>
                        </div>

                        {/* Hero Section */}
                        <div className="relative w-full h-[60vh] md:h-[80vh]">
                            <div className="absolute inset-0">
                                <video ref={heroVideoRef} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
                            </div>
                            <div className="absolute bottom-12 md:bottom-24 left-4 md:left-12 max-w-lg space-y-4">
                                <h1 className="text-5xl md:text-7xl font-bold mb-2 flex items-center gap-4">Sachin <Heart className="text-rose-500 fill-rose-500 animate-pulse" /> Priyanka</h1>
                                <div className="flex items-center gap-3 text-green-400 font-semibold mb-4">
                                    <span className="text-white/60 border border-white/40 px-1 text-sm">HD</span>
                                    <span className="text-white">2 Videos</span>
                                </div>
                                <p className="text-lg text-white/90 drop-shadow-md line-clamp-3">A timeless romance capturing the beautiful moments of two souls intertwined by destiny.</p>
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => { setSelectedVideo(video1Hls); setIsPlaying(true); }} className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-white/90 transition-colors"><Play fill="black" size={24} /> Play</button>
                                    <button className="flex items-center gap-2 bg-gray-500/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/50 transition-colors"><Info size={24} /> More Info</button>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="px-4 md:px-12 -mt-10 md:-mt-20 relative z-10 pb-20">
                            <h3 className="text-xl font-semibold mb-4 text-white/90">Trending Now</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {videos.map((v) => (
                                    <motion.div key={v.id} whileHover={{ scale: 1.05, zIndex: 20 }} className="bg-[#2f2f2f] rounded-md overflow-hidden cursor-pointer group relative aspect-video" onClick={() => { setSelectedVideo(v.src); setIsPlaying(true); }}>
                                        <img src={v.thumbnail} alt={v.title} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play fill="white" size={24} className="mb-2" />
                                            <h4 className="font-bold text-sm">{v.title}</h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Immersive Player */}
                        <AnimatePresence>
                            {selectedVideo && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseMove={handleMouseMove} className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden h-[100dvh]">
                                    {/* Desktop Blurred Background */}
                                    <div className="absolute inset-0 z-0 hidden md:block">
                                        <video ref={backgroundVideoRef} muted playsInline className="w-full h-full object-cover opacity-30 blur-3xl scale-110" />
                                        <div className="absolute inset-0 bg-black/40" />
                                    </div>

                                    {/* Primary Video */}
                                    <video ref={videoRef} autoPlay playsInline muted={isMuted} onTimeUpdate={handleTimeUpdate} onClick={togglePlay}
                                        className="relative z-10 w-full h-full md:w-auto md:max-h-full aspect-[9/16] object-cover md:object-contain shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                                    />

                                    <AnimatePresence>
                                        {!isPlaying && (
                                            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="absolute z-20 pointer-events-none">
                                                <div className="bg-black/40 p-8 rounded-full backdrop-blur-md text-white"><Play size={80} fill="white" /></div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Controls */}
                                    <motion.div animate={{ opacity: showControls ? 1 : 0 }} transition={{ duration: 0.3 }} className="absolute inset-x-0 bottom-0 top-0 z-30 flex flex-col justify-between p-6 md:p-12 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none select-none">
                                        <button onClick={() => setSelectedVideo(null)} className="pointer-events-auto flex items-center gap-2 group w-fit">
                                            <div className="p-3 rounded-full hover:bg-white/20 transition-all group-hover:scale-110 text-white"><ArrowLeft size={32} /></div>
                                            <span className="text-xl font-medium opacity-0 group-hover:opacity-100 transition-opacity">Back</span>
                                        </button>

                                        <div className="space-y-6 md:space-y-8 pointer-events-auto">
                                            <input type="range" min="0" max="100" value={progress} onChange={handleSeek} className="w-full h-1 md:h-2 accent-[#E50914] bg-white/30 rounded-full appearance-none cursor-pointer hover:h-4 transition-all" />
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-8 md:gap-12 text-white">
                                                    <button onClick={togglePlay} className="hover:scale-110 transition-transform">{isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" />}</button>
                                                    <button onClick={() => { if (videoRef.current) { const t = videoRef.current.currentTime - 10; videoRef.current.currentTime = t; if (backgroundVideoRef.current) backgroundVideoRef.current.currentTime = t; } }} className="hover:scale-110 transition-transform"><RotateCcw size={32} /></button>
                                                    <button onClick={() => setIsMuted(!isMuted)} className="hover:scale-110 transition-transform">{isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}</button>
                                                </div>
                                                <div className="hidden md:block text-2xl font-bold text-white/90 italic tracking-widest uppercase">Forever Love</div>
                                                <button className="hover:scale-110 transition-transform text-white"><Maximize size={32} /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default LoveStreaming;
