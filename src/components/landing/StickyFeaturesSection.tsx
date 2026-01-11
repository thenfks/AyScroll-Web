import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout, Compass, CircleUser, BarChart2 } from "lucide-react";
import AyscrollIPhone from "@/components/model/AyscrollIPhone";

const features = [
  {
    title: "Your Feed",
    desc: "A personalized stream of micro-learning content tailored to your interests.",
    image: "/images/ayscroll-personalized-feed-learning.png",
    islandLine1: "AyScroll Feed",
    islandLine2: "Learning via scrolling",
    icon: Layout
  },
  {
    title: "Explore",
    desc: "Discover new passions and dive deep into curated topics from around the world.",
    image: "/images/ayscroll-explore-topics-mobile.png",
    islandLine1: "Explore Topics",
    islandLine2: "Curated for you",
    icon: Compass
  },
  {
    title: "Profile",
    desc: "Track your progress, save your favorite snippets, and build your knowledge base.",
    image: "/images/ayscroll-profile-progress-mobile.png",
    islandLine1: "Your Profile",
    islandLine2: "Track your progress",
    icon: CircleUser
  },
  {
    title: "Smart Analytics",
    desc: "Visualize your learning journey. Identify strengths, spot gaps, and optimize your retention with AI-driven insights.",
    image: "/images/ayscroll-learning-analytics-dashboard.png",
    islandLine1: "Weekly Report",
    islandLine2: "+25% Retention Rate",
    icon: BarChart2
  }
];

export const StickyFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const stickyRef = useRef(null);
  const { scrollYProgress: scrollYProgressSticky } = useScroll({
    target: stickyRef,
    offset: ["start end", "end start"],
  });
  const ySticky = useTransform(scrollYProgressSticky, [0, 1], [-50, 50]);

  return (
    <section ref={stickyRef} className="relative bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start">
          {/* Left Column: Scrolling Text */}
          <div className="w-full md:w-1/2 py-12 sm:py-16 md:py-20 min-h-screen">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-center p-4 sm:p-6"
                initial={{ opacity: 0.2 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                onViewportEnter={() => setActiveFeature(index)}
              >
                <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 ${activeFeature === index ? 'bg-zinc-900/50 border-white/5 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'bg-transparent border-transparent'}`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-colors duration-500 ${activeFeature === index ? 'bg-gradient-to-br from-pink-500 to-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 transition-colors duration-300 ${activeFeature === index ? 'text-white' : 'text-zinc-500'}`}>{feature.title}</h3>
                  <p className="text-lg sm:text-xl text-zinc-400 max-w-md leading-relaxed">{feature.desc}</p>
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
  );
};
