import React from 'react';
import { Apple, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AntigravityBackground } from '@/components/effects/AntigravityBackground';

export const DownloadSection: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20 px-4 sm:px-6">
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

                            <Apple className="w-8 h-8 text-white fill-current relative z-10" />
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

                            <Play className="w-7 h-7 text-white fill-current relative z-10" />
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

                {/* Right Side - Particle Sphere (visible space) */}
                <div className="hidden md:block relative h-[600px]">
                    {/* This space is for the particle sphere which renders on the right */}
                </div>
            </div>
        </section>
    );
};
