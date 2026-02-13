
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Gift, PartyPopper } from 'lucide-react';

interface ValentineSurpriseProps {
    onClose: () => void;
}

const QUESTIONS = [
    {
        question: "Who fell in love first? 😉",
        options: ["Sachin (obviously)", "Priyanka (secretly)", "Both at the same time!"],
        correct: 2,
        reward: "❤️ Correct! It was destiny!"
    },
    {
        question: "How much does Sachin love Priyanka?",
        options: ["To the moon and back", "More than words can say", "Infinity x Infinity!"],
        correct: 2,
        reward: "💖 Absolutely! Infinite love!"
    },
    {
        question: "What's the best thing about us?",
        options: ["Our chemistry", "Our late-night talks", "Everything about us!"],
        correct: 2,
        reward: "✨ You're right, everything is perfect!"
    }
];

const ValentineSurprise: React.FC<ValentineSurpriseProps> = ({ onClose }) => {
    const [stage, setStage] = useState(0); // 0: Start, 1-3: Quiz, 4: Valentine Question, 5: Surprise
    const [quizIndex, setQuizIndex] = useState(0);
    const [showReward, setShowReward] = useState("");
    const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
    const [explosion, setExplosion] = useState(false);

    const handleStart = () => setStage(1);

    const handleAnswer = (index: number) => {
        setShowReward(QUESTIONS[quizIndex].reward);
        setTimeout(() => {
            setShowReward("");
            if (quizIndex < QUESTIONS.length - 1) {
                setQuizIndex(quizIndex + 1);
            } else {
                setStage(4);
            }
        }, 2000);
    };

    const moveNoButton = () => {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        setNoButtonPos({ x, y });
    };

    const handleYes = () => {
        setStage(5);
        setTimeout(() => setExplosion(true), 300);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {stage === 0 && (
                    <motion.div
                        key="start"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="flex flex-col items-center gap-8 cursor-pointer group"
                        onClick={handleStart}
                    >
                        <div className="absolute inset-0 bg-rose-600/20 blur-3xl rounded-full group-hover:bg-rose-600/40 transition-colors animate-pulse" />
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <Heart className="w-40 h-40 text-rose-500 fill-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-romantic text-rose-300 text-center">
                            Priyanka, I have a playful challenge for you... <br />
                            <span className="text-2xl font-script text-rose-400 opacity-80 mt-4 block">(Tap the heart to start)</span>
                        </h2>
                    </motion.div>
                )}

                {stage >= 1 && stage <= 3 && (
                    <motion.div
                        key="quiz"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        className="w-full max-w-2xl px-6"
                    >
                        <div className="bg-white/10 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/20 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-rose-400 font-script text-2xl">Question {quizIndex + 1}/3</span>
                                <Stars className="text-yellow-400 animate-spin-slow" />
                            </div>

                            <h3 className="text-3xl md:text-4xl font-romantic text-white mb-10 text-center">
                                {QUESTIONS[quizIndex].question}
                            </h3>

                            <div className="grid gap-4">
                                {QUESTIONS[quizIndex].options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(i)}
                                        className="p-5 rounded-2xl bg-white/5 border border-white/10 text-rose-100 text-xl transition-all text-left"
                                    >
                                        {opt}
                                    </motion.button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {showReward && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-8 text-center text-rose-400 font-romantic text-3xl"
                                    >
                                        {showReward}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {stage === 4 && (
                    <motion.div
                        key="question"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center relative z-10"
                    >
                        <h1 className="text-6xl md:text-8xl font-romantic text-rose-300 mb-16 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                            Will you be my Valentine, Priyanka?
                        </h1>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-12">
                            <motion.button
                                whileHover={{ scale: 1.2, boxShadow: "0 0 40px rgba(244,63,94,0.6)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleYes}
                                className="px-16 py-6 bg-rose-500 rounded-full text-white text-3xl font-bold font-romantic shadow-xl flex items-center gap-3"
                            >
                                Yes, Forever! <Heart className="fill-white" />
                            </motion.button>

                            <motion.button
                                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                                onMouseEnter={moveNoButton}
                                onClick={moveNoButton}
                                className="px-12 py-4 bg-gray-500/30 rounded-full text-gray-300 text-xl font-script backdrop-blur-sm border border-white/10"
                            >
                                No!
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {stage === 5 && (
                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                        <AnimatePresence>
                            {explosion && Array.from({ length: 60 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                    animate={{
                                        scale: [0, 2, 0],
                                        x: (Math.random() - 0.5) * 1500,
                                        y: (Math.random() - 0.5) * 1500,
                                        opacity: 0,
                                        rotate: Math.random() * 720
                                    }}
                                    transition={{ duration: 3, ease: "easeOut" }}
                                    className="absolute"
                                >
                                    {i % 2 === 0 ? <Heart className="w-8 h-8 text-rose-400 fill-rose-400" /> : <PartyPopper className="w-8 h-8 text-yellow-400" />}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.5 }}
                            className="z-10 text-center px-6"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    filter: ["drop-shadow(0 0 10px #f43f5e)", "drop-shadow(0 0 40px #f43f5e)", "drop-shadow(0 0 10px #f43f5e)"]
                                }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="bg-white/5 backdrop-blur-xl p-16 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(244,63,94,0.4)]"
                            >
                                <Gift className="w-16 h-16 text-rose-400 mb-8 mx-auto animate-bounce" />
                                <h1 className="text-6xl md:text-9xl font-romantic text-rose-300 mb-8">
                                    Yesss! Happy Valentine's Day!
                                </h1>
                                <p className="text-3xl md:text-5xl text-rose-100 font-script max-w-3xl mx-auto leading-relaxed mb-12">
                                    Priyanka, you make my world so much brighter. I promise to love you, annoy you (just a bit), and cherish you forever.
                                </p>
                                <div className="flex justify-center gap-8">
                                    <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                        <Heart className="w-20 h-20 text-rose-500 fill-rose-500" />
                                    </motion.div>
                                    <motion.div animate={{ rotate: [0, -20, 20, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>
                                        <Heart className="w-20 h-20 text-rose-500 fill-rose-500" />
                                    </motion.div>
                                    <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>
                                        <Heart className="w-20 h-20 text-rose-500 fill-rose-500" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 4 }}
                                onClick={onClose}
                                className="mt-12 text-rose-400 hover:text-white transition-colors underline decoration-rose-500/50 underline-offset-8 text-xl"
                            >
                                Close and keep celebrating us
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ValentineSurprise;
