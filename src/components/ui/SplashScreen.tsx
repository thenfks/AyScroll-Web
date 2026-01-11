import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete?: () => void;
    duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
    onComplete,
    duration = 3000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onComplete?.();
            }, 500); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
                >
                    {/* Animated Background Gradient */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-black to-orange-500/10"
                        animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />

                    {/* Logo Container */}
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        {/* Logo with Scale Animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 20,
                                duration: 1,
                            }}
                        >
                            <img
                                src="/ayscroll-official-logo.png"
                                alt="AyScroll"
                                className="w-32 h-32 sm:w-40 sm:h-40"
                            />
                        </motion.div>

                        {/* App Name with Slide Up Animation */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                                    AyScroll
                                </span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="text-zinc-400 text-sm sm:text-base mt-2"
                            >
                                Learn by Scrolling
                            </motion.p>
                        </motion.div>

                        {/* Loading Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.5 }}
                            className="flex gap-2 mt-4"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
