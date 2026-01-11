import Logo from "/images/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Music } from "lucide-react";
import { useEffect, useState } from "react";

type DynamicIslandProps = {
    isExpanded?: boolean;
    title?: string;
    subtitle?: string;
};

const islandVariants = {
    notch: {
        width: 120,
        height: 30,
        borderRadius: "9999px",
        transition: { type: "spring" as const, stiffness: 400, damping: 25 },
    },
    expanded: {
        width: 260,
        height: 48,
        borderRadius: "9999px",
        transition: { type: "spring" as const, stiffness: 400, damping: 25, delay: 0.2 },
    },
};

const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
};

export default function AyscrollDynamicIsland({ isExpanded: propIsExpanded, title, subtitle }: DynamicIslandProps) {
    const [internalIsExpanded, setInternalIsExpanded] = useState(false);

    const isExpanded = propIsExpanded ?? internalIsExpanded;
    const currentTitle = title ?? "Initializing App";
    const currentSubtitle = subtitle ?? "Click on Play Button";

    useEffect(() => {
        if (propIsExpanded === undefined) {
            const sequence = async () => {
                setInternalIsExpanded(false);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setInternalIsExpanded(true);
                await new Promise(resolve => setTimeout(resolve, 3000));
            };

            sequence();
            const interval = setInterval(sequence, 6000);
            return () => clearInterval(interval);
        }
    }, [propIsExpanded]);

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                layout
                variants={islandVariants}
                animate={isExpanded ? "expanded" : "notch"}
                className="relative bg-black flex items-center justify-center shadow-lg"
            >
                <AnimatePresence>
                    {!isExpanded && (
                        <motion.div
                            key="logo"
                            variants={logoVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute"
                        >
                            <img src={Logo} alt="Ayscroll Logo" className="w-5 h-5" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            key="content"
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex items-center justify-between w-full px-4"
                        >
                            <div className="flex items-center space-x-2">
                                <img src={Logo} alt="Ayscroll Logo" className="w-6 h-6" />
                                <div>
                                    <p className="text-xs font-medium text-white">{currentTitle}</p>
                                    <p className="text-[10px] text-gray-400">{currentSubtitle}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <Music className="w-4 h-4 text-purple-400" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
