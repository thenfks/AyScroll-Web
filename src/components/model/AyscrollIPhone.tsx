import { useState, useEffect } from "react";
import AyscrollDynamicIsland from "./AyscrollDynamicIsland";
import { Play, Pause } from "lucide-react";
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
    // State for the original, non-scrollable component
    const [isClicked, setIsClicked] = useState(false);

    // State for the new scrollable feature
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (scrollable && isPlaying && content.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
            }, speed);

            return () => clearInterval(interval);
        }
    }, [scrollable, isPlaying, content.length, speed]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handlePlay = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 5000); // Revert after 5 seconds
    };

    const playPauseButtonVariants = {
        initial: {
            opacity: (!autohide || !isPlaying) ? 1 : 0,
            scale: (!autohide || !isPlaying) ? 1 : 0.8,
        },
        hover: { opacity: 1, scale: 1 },
    };

    if (!scrollable) {
        // Original non-scrollable behavior
        return (
            <motion.div
                className="relative flex justify-center"
                initial="initial"
                whileHover="hover"
            >
                {/* PHONE BODY */}
                <div className="relative w-[320px] h-[690px] rounded-[48px] bg-[#0a0a0c] shadow-[0_50px_140px_rgba(0,0,0,0.7)]">

                    {/* SCREEN */}
                    <div className="absolute inset-[10px] rounded-[42px] bg-black overflow-hidden bg-[#0d0d0d]">
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
                        <AnimatePresence>
                            {!isClicked && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    variants={playPauseButtonVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.button
                                        onClick={handlePlay}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10"
                                    >
                                        <Play className="w-8 h-8 text-white fill-white" />
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* subtle glass highlight */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
                    </div>

                    {/* DYNAMIC ISLAND */}
                    <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-40">
                        {isClicked || forceExpandedIsland ? (
                            <AyscrollDynamicIsland
                                isExpanded={true}
                                title={dynamicIslandContentLine1}
                                subtitle={dynamicIslandContentLine2}
                            />
                        ) : (
                            <AyscrollDynamicIsland />
                        )}
                    </div>

                    {/* SIDE BUTTONS */}
                    {/* Volume Up */}
                    <div className="absolute left-[-2px] top-[140px] w-[2px] h-[36px] rounded bg-gray-600" />
                    {/* Volume Down */}
                    <div className="absolute left-[-2px] top-[190px] w-[2px] h-[36px] rounded bg-gray-600" />
                    {/* Power */}
                    <div className="absolute right-[-2px] top-[165px] w-[2px] h-[52px] rounded bg-gray-600" />
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
            <div className="relative w-[320px] h-[690px] rounded-[48px] bg-[#0a0a0c] shadow-[0_50px_140px_rgba(0,0,0,0.7)]">

                {/* SCREEN */}
                <div className="absolute inset-[10px] rounded-[42px] bg-black overflow-hidden">
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

                    {/* Play/Pause Button */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        variants={playPauseButtonVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.button
                            onClick={handlePlayPause}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/10"
                        >
                            {isPlaying ? (
                                <Pause className="w-8 h-8 text-white fill-white" />
                            ) : (
                                <Play className="w-8 h-8 text-white fill-white" />
                            )}
                        </motion.button>
                    </motion.div>

                    {/* subtle glass highlight */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
                </div>

                {/* DYNAMIC ISLAND */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-40">
                    <AyscrollDynamicIsland
                        isExpanded={isPlaying}
                        title={currentContent.dynamicIslandContentLine1}
                        subtitle={currentContent.dynamicIslandContentLine2}
                    />
                </div>

                {/* SIDE BUTTONS */}
                <div className="absolute left-[-2px] top-[140px] w-[2px] h-[36px] rounded bg-gray-600" />
                <div className="absolute left-[-2px] top-[190px] w-[2px] h-[36px] rounded bg-gray-600" />
                <div className="absolute right-[-2px] top-[165px] w-[2px] h-[52px] rounded bg-gray-600" />
            </div>
        </motion.div>
    );
}
