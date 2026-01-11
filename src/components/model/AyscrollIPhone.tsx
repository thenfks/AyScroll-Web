import { useState, useEffect } from "react";
import AyscrollDynamicIsland from "./AyscrollDynamicIsland";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollableContent {
    image: string;
    dynamicIslandContentLine1: string;
    dynamicIslandContentLine2: string;
}

interface AyscrollIPhoneProps {
    scrollable?: boolean;
    image?: string;
    dynamicIslandContentLine1?: string;
    dynamicIslandContentLine2?: string;
    content?: ScrollableContent[];
    speed?: number; // Delay for each image in ms
    autohide?: boolean; // Autohide play/pause button
    forceExpandedIsland?: boolean; // Always show expanded dynamic island
}

export default function AyscrollIPhone({
    scrollable = false,
    image,
    dynamicIslandContentLine1,
    dynamicIslandContentLine2,
    content = [],
    speed = 3000, // Default speed: 3 seconds
    autohide = false, // Default autohide: false
    forceExpandedIsland = false,
}: AyscrollIPhoneProps) {
    // State for the new scrollable feature
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Auto-scroll if scrollable is true and speed is set (assuming auto-play if no button controls)
        if (scrollable && content.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
            }, speed);

            return () => clearInterval(interval);
        }
    }, [scrollable, content.length, speed]);



    if (!scrollable) {
        // Original non-scrollable behavior
        return (
            <motion.div
                className="relative flex justify-center"
                initial="initial"
                whileHover="hover"
            >
                {/* PHONE BODY */}
                {/* PHONE BODY - 3D ENHANCED (Slimmer) */}
                <div className="relative w-[320px] h-[690px] rounded-[55px] bg-[#121212] shadow-[0_0_0_2px_#27272a,0_0_0_5px_#3f3f46,0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-2 border-zinc-800">

                    {/* Metallic Shine Overlay */}
                    <div className="absolute inset-0 rounded-[50px] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50" />

                    {/* SCREEN */}
                    <div className="absolute inset-[6px] rounded-[48px] bg-black overflow-hidden shadow-[inset_0_0_10px_2px_rgba(0,0,0,0.8)] border border-white/5">
                        <AnimatePresence mode="popLayout">
                            <motion.img
                                key={image}
                                src={image}
                                alt="Ayscroll App"
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            />
                        </AnimatePresence>

                        {/* Play Button */}


                        {/* subtle glass highlight */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
                    </div>

                    {/* DYNAMIC ISLAND */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-40">
                        {forceExpandedIsland ? (
                            <AyscrollDynamicIsland
                                isExpanded={true}
                                title={dynamicIslandContentLine1}
                                subtitle={dynamicIslandContentLine2}
                            />
                        ) : (
                            <AyscrollDynamicIsland />
                        )}
                    </div>

                    {/* SIDE BUTTONS - 3D EXTRUDED */}
                    {/* Volume Up */}
                    <div className="absolute left-[-6px] top-[140px] w-[6px] h-[36px] rounded-l-md bg-zinc-700 shadow-[inset_-2px_0_2px_rgba(0,0,0,0.5)] border-l border-zinc-600" />
                    {/* Volume Down */}
                    <div className="absolute left-[-6px] top-[190px] w-[6px] h-[36px] rounded-l-md bg-zinc-700 shadow-[inset_-2px_0_2px_rgba(0,0,0,0.5)] border-l border-zinc-600" />
                    {/* Power */}
                    <div className="absolute right-[-6px] top-[165px] w-[6px] h-[52px] rounded-r-md bg-zinc-700 shadow-[inset_2px_0_2px_rgba(0,0,0,0.5)] border-r border-zinc-600" />
                </div>
            </motion.div>
        );
    }

    // New scrollable behavior
    const currentContent = content[currentIndex];

    return (
        <motion.div
            className="relative flex justify-center"
            initial="initial"
            whileHover="hover"
            animate="initial"
        >
            {/* PHONE BODY */}
            {/* PHONE BODY - 3D ENHANCED (Slimmer) */}
            <div className="relative w-[320px] h-[690px] rounded-[55px] bg-[#121212] shadow-[0_0_0_2px_#27272a,0_0_0_5px_#3f3f46,0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] border-2 border-zinc-800">

                {/* Metallic Shine Overlay */}
                <div className="absolute inset-0 rounded-[50px] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-50" />

                {/* SCREEN */}
                <div className="absolute inset-[6px] rounded-[48px] bg-black overflow-hidden shadow-[inset_0_0_10px_2px_rgba(0,0,0,0.8)] border border-white/5">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ y: "100%", opacity: 0.8 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0.8 }}
                            transition={{ type: "tween", duration: 1, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={currentContent.image}
                                alt={`Ayscroll content ${currentIndex + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </AnimatePresence>



                    {/* subtle glass highlight */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
                </div>

                {/* DYNAMIC ISLAND */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-40">
                    <AyscrollDynamicIsland
                        isExpanded={true} // Always expanded for scrollable content context if desired, or false. Previously linked to isPlaying. Let's default to false unless forced? Actually previously isExpanded={isPlaying}. If isPlaying removed, maybe default to true? Or false? User said remove play button. Let's make it static unless forceExpandedIsland is passed? Actually in scrollable mode, dynamic island usually shows content. Let's default to false to be safe unless we want to auto-expand. Let's keep it false for now or use forceExpandedIsland. Wait, scrollable content usually updates the island text. It should probably be expanded if content is present? Let's check original logic. Original: isExpanded={isPlaying}. If I made it auto-play (see above chunk), maybe I should make it isExpanded={true} or isExpanded={scrollable}? Let's use isExpanded={true} for scrollable with content.
                        title={currentContent.dynamicIslandContentLine1}
                        subtitle={currentContent.dynamicIslandContentLine2}
                    />
                </div>

                {/* SIDE BUTTONS - 3D EXTRUDED */}
                <div className="absolute left-[-6px] top-[140px] w-[6px] h-[36px] rounded-l-md bg-zinc-700 shadow-[inset_-2px_0_2px_rgba(0,0,0,0.5)] border-l border-zinc-600" />
                <div className="absolute left-[-6px] top-[190px] w-[6px] h-[36px] rounded-l-md bg-zinc-700 shadow-[inset_-2px_0_2px_rgba(0,0,0,0.5)] border-l border-zinc-600" />
                <div className="absolute right-[-6px] top-[165px] w-[6px] h-[52px] rounded-r-md bg-zinc-700 shadow-[inset_2px_0_2px_rgba(0,0,0,0.5)] border-r border-zinc-600" />
            </div>
        </motion.div>
    );
}
