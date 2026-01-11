import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Globe, Zap, Download, Monitor, Brain, BookOpen, Twitter, Instagram, Linkedin, Github, Layout, Compass, CircleUser, BarChart2 } from "lucide-react";
import { RollingText } from "@/components/effects/rollingText";
import AyscrollIPhone from "@/components/model/AyscrollIPhone";
import CategoryGlobe from "@/components/effects/CategoryGlobe";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    Code, Beaker, History, Palette, Cpu, TreePalm, Gamepad2,
    Share2, Atom, Rocket, Camera, Book, FlaskConical,
    Microchip, GraduationCap, PenTool, Music, Video, Database,
    Cloud, Shield, BrainCircuit, Wallet, Globe2
} from "lucide-react";

const RotatingTextWrapper = () => {
    const words = ["Scrolling", "Watching", "Thinking", "Scrolling"];
    return (
        <RollingText
            text={words[0]}
            className="text-pink-500 ml-3 font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent"
        />
    );
};

export default function Landing() {
    // Parallax & Sticky State
    const [activeFeature, setActiveFeature] = useState(0);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

    // Parallax & Device Section State
    const devicesRef = useRef(null);
    const { scrollYProgress: scrollYProgressDevices } = useScroll({
        target: devicesRef,
        offset: ["start end", "end start"],
    });
    const yIpad = useTransform(scrollYProgressDevices, [0, 1], [100, -100]);
    const yIphone = useTransform(scrollYProgressDevices, [0, 1], [200, -200]);

    // Sticky Parallax State
    const stickyRef = useRef(null);
    const { scrollYProgress: scrollYProgressSticky } = useScroll({
        target: stickyRef,
        offset: ["start end", "end start"],
    });
    const ySticky = useTransform(scrollYProgressSticky, [0, 1], [-50, 50]);

    const features = [
        {
            title: "Your Feed",
            desc: "A personalized stream of micro-learning content tailored to your interests.",
            image: "/images/Ayscroll_App_FeedPage.png",
            islandLine1: "AyScroll Feed",
            islandLine2: "Learning via scrolling",
            icon: Layout
        },
        {
            title: "Explore",
            desc: "Discover new passions and dive deep into curated topics from around the world.",
            image: "/images/ayscroll_iphone2.png",
            islandLine1: "Explore Topics",
            islandLine2: "Curated for you",
            icon: Compass
        },
        {
            title: "Profile",
            desc: "Track your progress, save your favorite snippets, and build your knowledge base.",
            image: "/images/ayscroll_iphone3.png",
            islandLine1: "Your Profile",
            islandLine2: "Track your progress",
            icon: CircleUser
        },
        {
            title: "Smart Analytics",
            desc: "Visualize your learning journey. Identify strengths, spot gaps, and optimize your retention with AI-driven insights.",
            image: "/images/Ayscroll_App_Analysis.png",
            islandLine1: "Weekly Report",
            islandLine2: "+25% Retention Rate",
            icon: BarChart2
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500 selection:text-white font-sans">
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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

            {/* NEW: Parallax Feature Section */}
            <section ref={containerRef} className="relative py-32 px-6 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/20 to-black z-0" />

                <motion.div style={{ y }} className="relative z-10 w-full max-w-5xl">
                    <img src="/images/ayscroll_imac.png" alt="AyScroll Desktop Experience" className="w-full h-auto drop-shadow-2xl" />
                </motion.div>

                <div className="relative z-20 text-center mt-[-10%] sm:mt-[-5%]">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
                        AyScroll <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Features</span>
                    </h2>
                </div>
            </section>

            {/* NEW: Sticky Layout Section */}
            <section ref={stickyRef} className="relative bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start">

                        {/* Left Column: Scrolling Text */}
                        <div className="w-full md:w-1/2 py-20 min-h-screen">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="min-h-[60vh] flex flex-col justify-center p-6"
                                    initial={{ opacity: 0.2 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ margin: "-40% 0px -40% 0px" }}
                                    onViewportEnter={() => setActiveFeature(index)}
                                >
                                    <div className={`p-8 rounded-3xl border transition-all duration-500 ${activeFeature === index ? 'bg-zinc-900/50 border-white/5 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'bg-transparent border-transparent'}`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${activeFeature === index ? 'bg-gradient-to-br from-pink-500 to-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${activeFeature === index ? 'text-white' : 'text-zinc-500'}`}>{feature.title}</h3>
                                        <p className="text-xl text-zinc-400 max-w-md leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right Column: Sticky iPhone */}
                        <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center">
                            <motion.div style={{ y: ySticky }} className="scale-90 xl:scale-100 transition-all duration-500">
                                <AyscrollIPhone
                                    image={features[activeFeature].image}
                                    dynamicIslandContentLine1={features[activeFeature].islandLine1}
                                    dynamicIslandContentLine2={features[activeFeature].islandLine2}
                                    forceExpandedIsland={true}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature 2 (Reversed) - Keep for now as "Save your knowledge base" but with static iphone? Or remove? User asked for Parallax then Sticky. I will leave this as "Save your knowledge base" but maybe revert it to the static display or keep the interactive one if it adds value. User said "then in next Section Add iphonemockup and as we scroll down make different feature appear". That's the Sticky section. I'll keep the "Feature 2" (Download) as another section below or remove if redundant. I'll keep it as a "Download/Offline" feature block. */}
            <section className="py-20 px-6 bg-black">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="order-2 md:order-1 relative flex justify-center h-[600px] md:h-[800px] items-center"
                        ref={devicesRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* iPad - Back Layer - Slower Parallax */}
                            <motion.img
                                style={{ y: yIpad }}
                                src="/images/ayscroll_ipad.png"
                                alt="AyScroll on iPad"
                                className="absolute w-[100%] md:w-[90%] max-w-[900px] z-10 left-[-10%] md:left-[-5%] drop-shadow-2xl"
                            />

                            {/* iPhone - Front Layer - Faster Parallax */}
                            <motion.img
                                style={{ y: yIphone }}
                                src="/images/ayscroll_iphone.png"
                                alt="AyScroll on iPhone"
                                className="absolute w-[50%] md:w-[45%] max-w-[450px] z-20 right-[-5%] md:right-[5%] bottom-[-5%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </motion.div>
                    <div className="order-1 md:order-2 space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Save</span> your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">knowledge</span> base.
                        </h2>
                        <p className="text-xl md:text-2xl text-zinc-300">
                            Save interesting snippets, build your personal library, and access your wisdom offline anywhere.
                        </p>
                    </div>
                </div>
            </section>

            {/* NEW: Category Globe Section */}
            <section className="relative py-32 bg-black overflow-hidden flex flex-col items-center justify-center min-h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1)_0%,rgba(0,0,0,0)_70%)]" />

                <div className="relative z-10 text-center mb-16 px-6">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Universe</span> of Knowledge
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        From Quantum Physics to Renaissance Art, dive into thousands of curated micro-courses.
                    </p>
                </div>

                <div className="w-full mx-auto h-[600px] md:h-[800px] relative z-0 mt-[-50px]">
                    <CategoryGlobe
                        icons={[
                            { Icon: Code, label: "Coding", color: "#3b82f6" },
                            { Icon: Beaker, label: "Science", color: "#10b981" },
                            { Icon: History, label: "History", color: "#f59e0b" },
                            { Icon: Palette, label: "Art", color: "#ec4899" },
                            { Icon: Cpu, label: "Tech", color: "#6366f1" },
                            { Icon: TreePalm, label: "Nature", color: "#84cc16" },
                            { Icon: Gamepad2, label: "Gaming", color: "#a855f7" },
                            { Icon: Share2, label: "Social", color: "#06b6d4" },
                            { Icon: Atom, label: "Physics", color: "#ef4444" },
                            { Icon: Rocket, label: "Space", color: "#f97316" },
                            { Icon: Camera, label: "Photography", color: "#14b8a6" },
                            { Icon: Book, label: "Literature", color: "#d946ef" },
                            { Icon: FlaskConical, label: "Chemistry", color: "#22c55e" },
                            { Icon: Microchip, label: "Electronics", color: "#eab308" },
                            { Icon: GraduationCap, label: "Education", color: "#3b82f6" },
                            { Icon: PenTool, label: "Design", color: "#f43f5e" },
                            { Icon: Music, label: "Music", color: "#8b5cf6" },
                            { Icon: Video, label: "Video", color: "#ef4444" },
                            { Icon: Database, label: "Data", color: "#10b981" },
                            { Icon: Cloud, label: "Cloud", color: "#0ea5e9" },
                            { Icon: Shield, label: "Security", color: "#f59e0b" },
                            { Icon: BrainCircuit, label: "AI", color: "#d946ef" },
                            { Icon: Wallet, label: "Finance", color: "#14b8a6" },
                            { Icon: Globe2, label: "Languages", color: "#f97316" },
                        ]}
                        radius={300}
                    />
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
