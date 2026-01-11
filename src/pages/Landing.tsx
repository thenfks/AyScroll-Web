import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Globe, Zap, Download, Monitor, Brain, BookOpen, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { RollingText } from "@/components/effects/rollingText";
import { useState, useEffect } from "react";


const RotatingTextWrapper = () => {
    const words = ["Scrolling", "Watching", "Thinking", "Scrolling"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, 3000); // Slower cycle for rolling effect
        return () => clearInterval(interval);
    }, []);

    return (
        <RollingText
            key={words[index]} // Force re-render on word change to trigger animation
            text={words[index]}
            className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500 ml-3 font-bold px-1 pb-1"
        />
    );
};

export default function Landing() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white font-sans overflow-x-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-b from-black/90 via-black/60 to-transparent px-6 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="AyScroll" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                        <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">AyScroll</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/signin">
                            <Button className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 rounded-2xl font-bold px-6 py-2 transition-all shadow-lg shadow-pink-500/20">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pb-18 sm:pb-0">
                {/* Background - Minimalistic Netflix-style Content Collage */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-black select-none pointer-events-none">
                    {/* Skewed Grid Container - Increased opacity for better visibility */}
                    <div className="absolute inset-0 min-w-[150%] -left-[25%] -top-[25%] opacity-80 transform -rotate-6 scale-105">
                        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 animate-scroll-slow">
                            {[
                                "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80", // Coding
                                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80", // Science
                                "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80", // History
                                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80", // Art
                                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80", // Tech
                                "https://images.unsplash.com/photo-1542204165-65926c4f1973?w=500&q=80", // Nature
                                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80", // Gaming
                                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80", // Social
                                "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&q=80", // Physics
                                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80", // Space
                                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80", // Camera
                                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80", // Lab
                                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80", // Chips
                                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", // Education
                                "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&q=80", // Design
                                "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80", // Coding Loop
                                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80", // Science Loop
                                "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80", // History Loop
                                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80", // Art Loop
                                "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80", // Extra 1
                                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80", // Extra 2
                                "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500&q=80", // Extra 3
                                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80", // Extra 4
                            ].map((src, i) => (
                                <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                                    <img src={src} className="w-full h-full object-cover opacity-100 hover:scale-105 transition-transform duration-700" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Deep Vignette for focus - Lighter for visibility */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.8)_100%)]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
                </div>

                <div className="relative z-10 max-w-4xl space-y-8 pt-32">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight flex flex-wrap justify-center items-center gap-2">
                        Learn by
                        <RotatingTextWrapper />
                    </h1>
                    <p className="text-lg md:text-xl font-normal text-zinc-300 max-w-2xl mx-auto">
                        Experience micro-learning that flows with your natural rhythm. <br className="hidden md:block" /> Bite-sized lessons for curious minds.
                    </p>
                    <div className="space-y-6 pt-6">
                        <p className="text-base text-zinc-400">
                            Ready to learn? Enter your email to start your journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full sm:flex-1 h-12 bg-black/50 border border-white/20 rounded-md px-4 text-white text-base placeholder:text-zinc-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all backdrop-blur-sm"
                            />
                            <Link to="/feed" className="w-full sm:w-auto">
                                <Button className="w-full h-12 px-8 text-lg font-semibold bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-2xl flex items-center justify-center gap-2 group shadow-lg shadow-pink-500/20 border-0">
                                    Get Started <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Seamless Fade Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
            </section>

            {/* Feature 1 */}
            <section className="py-20 px-6 bg-black border-b-8 border-zinc-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Bite-sized Education.</h2>
                        <p className="text-xl md:text-2xl text-zinc-300">
                            Ditch the hour-long lectures. Absorb complex topics through engaging, short-form videos tailored to your interests.
                        </p>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="relative z-10 w-full max-w-lg aspect-video bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                            <div className="relative z-10 p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 w-3/4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold">Quantum Physics</div>
                                        <div className="text-sm text-zinc-400">@science_daily • 60s</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-gradient-to-r from-pink-500 to-orange-500" />
                                    </div>
                                    <p className="text-xs text-zinc-400 text-right">Lesson 4 of 12</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2 (Reversed) */}
            <section className="py-20 px-6 bg-black border-b-8 border-zinc-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative flex justify-center">
                        <div className="relative z-10 w-full max-w-lg aspect-square bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center p-8 overflow-hidden">
                            <div className="relative w-3/4 aspect-[9/16] bg-zinc-800 border-4 border-zinc-700 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-cover bg-center rounded-xl opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')" }} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-3/4 bg-black border border-zinc-700 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                    <Download className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white">Saving for offline...</div>
                                    <div className="text-xs text-blue-400">History of Rome • 45MB</div>
                                </div>
                                <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Save your knowledge base.</h2>
                        <p className="text-xl md:text-2xl text-zinc-300">
                            Save interesting snippets, build your personal library, and access your wisdom offline anywhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature 3 */}
            <section className="py-20 px-6 bg-black border-b-8 border-zinc-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Learn everywhere.</h2>
                        <p className="text-xl md:text-2xl text-zinc-300">
                            Seamlessly sync your progress across phone, tablet, and laptop. Your personalized curriculum travels with you.
                        </p>
                    </div>
                    <div className="relative flex justify-center">
                        <div className="relative z-10 w-full max-w-lg aspect-video bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-8">
                            <div className="grid grid-cols-3 gap-8 w-full">
                                {[
                                    { Icon: Monitor, label: "Web" },
                                    { Icon: Brain, label: "AI" },
                                    { Icon: Zap, label: "Fast" }
                                ].map(({ Icon, label }, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center gap-4 p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group">
                                        <Icon className="w-10 h-10 text-zinc-500 group-hover:text-pink-500 transition-colors" />
                                        <span className="font-semibold text-zinc-300 group-hover:text-white transition-colors">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 4 */}
            <section className="py-20 px-6 bg-black border-b-8 border-zinc-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative flex justify-center">
                        <div className="relative z-10 w-full max-w-lg aspect-square bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center p-6">
                            <div className="grid grid-cols-2 gap-4 w-full h-full">
                                {[
                                    { color: "from-blue-500 to-cyan-500", title: "Coding" },
                                    { color: "from-purple-500 to-pink-500", title: "Design" },
                                    { color: "from-orange-500 to-red-500", title: "History" },
                                    { color: "from-green-500 to-emerald-500", title: "Business" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer border border-white/5 hover:border-pink-500/50 transition-all">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                                        <span className="relative z-10 font-bold text-xl group-hover:scale-110 transition-transform">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold">Curated for you.</h2>
                        <p className="text-xl md:text-2xl text-zinc-300">
                            Our AI tailors a unique learning path based on your curiosity. From Coding to Cooking, dive deep into what matters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 bg-black border-t border-white/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center gap-2 group">
                                <img src="/logo.png" alt="AyScroll" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
                                <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">AyScroll</span>
                                </span>
                            </Link>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                                Learn by scrolling. Knowledge, one scroll at a time. Join the future of micro-learning.
                            </p>
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: Twitter, href: "#" },
                                    { icon: Instagram, href: "#" },
                                    { icon: Linkedin, href: "#" },
                                    { icon: Github, href: "#" }
                                ].map((social, i) => (
                                    <a key={i} href={social.href} className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all hover:scale-110">
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-white mb-6">Product</h3>
                            <ul className="space-y-4 text-sm text-zinc-400">
                                {["Features", "How It Works", "Pricing", "Download"].map(item => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-white mb-6">Company</h3>
                            <ul className="space-y-4 text-sm text-zinc-400">
                                {["About", "Careers", "Blog", "Press"].map(item => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-white mb-6">Resources</h3>
                            <ul className="space-y-4 text-sm text-zinc-400">
                                {["Help Center", "Community", "Creator Guide", "API"].map(item => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
                        <p>© 2024 AyScroll. All rights reserved.</p>
                        <div className="flex items-center gap-8">
                            <div className="flex gap-8">
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms</a>
                                <a href="#" className="hover:text-white transition-colors">Cookies</a>
                            </div>
                            <span className="text-zinc-600">nFKs Affiliated</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
