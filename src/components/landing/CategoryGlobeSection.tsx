import CategoryGlobe from "@/components/effects/CategoryGlobe";
import {
  Code, Beaker, History, Palette, Cpu, TreePalm, Gamepad2,
  Share2, Atom, Rocket, Camera, Book, FlaskConical,
  Microchip, GraduationCap, PenTool, Music, Video, Database,
  Cloud, Shield, BrainCircuit, Wallet, Globe2
} from "lucide-react";

const categoryIcons = [
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
];

export const CategoryGlobeSection = () => {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[80vh] sm:min-h-screen">
      <div className="relative z-10 text-center mb-12 sm:mb-16 px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
          Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Universe</span> of Knowledge
        </h2>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
          From Quantum Physics to Renaissance Art, dive into thousands of curated micro-courses.
        </p>
      </div>

      <div className="w-full mx-auto h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] relative z-0 mt-[-30px] sm:mt-[-50px]">
        <CategoryGlobe icons={categoryIcons} radius={300} />
      </div>
    </section>
  );
};
