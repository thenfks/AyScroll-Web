import React, { useRef } from 'react';
import { Apple, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AntigravityBackground } from '@/components/effects/AntigravityBackground';
import { motion, useScroll, useTransform } from 'framer-motion';

export const DownloadSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effects for the two phones
    const yPhone1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yPhone2 = useTransform(scrollYProgress, [0, 1], [150, -150]);

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20 px-4 sm:px-6">
            {/* Antigravity Background */}
            <AntigravityBackground />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Text Content */}
                <div className="space-y-6 text-center md:text-left">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                        Download{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                            AyScroll
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-zinc-300 max-w-xl">
                        Start your micro-learning journey today. Available on iOS and Android.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        {/* App Store Button */}
                        <a
                            href="#"
                            className="group relative flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl hover:bg-zinc-800 hover:border-white/20 transition-all shadow-lg shadow-black/50 overflow-hidden"
                        >
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine pointer-events-none" />

                            <img src="/images/apple-logo.svg" alt="Apple" className="w-8 h-8 text-white relative z-10" />
                            <div className="text-left relative z-10">
                                <div className="text-[10px] uppercase text-zinc-400 font-bold leading-none mb-1">
                                    Download on the
                                </div>
                                <div className="text-lg font-bold text-white leading-none">
                                    App Store
                                </div>
                            </div>
                        </a>

                        {/* Google Play Button */}
                        <a
                            href="#"
                            className="group relative flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl hover:bg-zinc-800 hover:border-white/20 transition-all shadow-lg shadow-black/50 overflow-hidden"
                        >
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine pointer-events-none" />

                            <img src="/images/playstore.svg" alt="Google Play" className="w-7 h-7 relative z-10" />
                            <div className="text-left relative z-10">
                                <div className="text-[10px] uppercase text-zinc-400 font-bold leading-none mb-1">
                                    Get it on
                                </div>
                                <div className="text-lg font-bold text-white leading-none">
                                    Google Play
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto md:mx-0">
                        <div className="text-center md:text-left">
                            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                                10K+
                            </div>
                            <div className="text-xs sm:text-sm text-zinc-400 mt-1">Downloads</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                                4.8★
                            </div>
                            <div className="text-xs sm:text-sm text-zinc-400 mt-1">Rating</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                                50+
                            </div>
                            <div className="text-xs sm:text-sm text-zinc-400 mt-1">Topics</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - iPhone Mockups with Parallax */}
                <div className="hidden md:block relative h-[600px]">
                    {/* Phone 1 - Back */}
                    <motion.div
                        style={{ y: yPhone1 }}
                        className="absolute top-[10%] right-[20%] w-[280px] z-10"
                    >
                        <motion.img
                            src="/images/ayscroll-app-mobile-view.png"
                            alt="AyScroll iPhone App"
                            className="w-full h-auto drop-shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>

                    {/* Phone 2 - Front */}
                    <motion.div
                        style={{ y: yPhone2 }}
                        className="absolute top-[20%] right-[5%] w-[300px] z-20"
                    >
                        <motion.img
                            src="/images/ayscroll-app-mobile-view.png"
                            alt="AyScroll iPhone App"
                            className="w-full h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
