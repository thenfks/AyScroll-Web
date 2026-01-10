import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Flame, Zap, Target, Trophy, Brain, TrendingUp, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const stats = [
  { label: 'Streak', value: '12', unit: 'Days', icon: Flame, color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-500/10' },
  { label: 'Knowledge XP', value: '2,847', unit: 'Points', icon: Zap, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
  { label: 'Learning Velocity', value: '94%', unit: 'Faster', icon: Target, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10' },
  { label: 'Global Rank', value: '#142', unit: 'Top 5%', icon: Trophy, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
];

const proficiencyData = [
  { topic: 'System Design', progress: 85, color: 'from-pink-500 to-purple-500' },
  { topic: 'React Performance', progress: 72, color: 'from-blue-500 to-cyan-500' },
  { topic: 'UI/UX Principles', progress: 68, color: 'from-orange-500 to-yellow-500' },
  { topic: 'Data Structures', progress: 45, color: 'from-emerald-500 to-teal-500' },
];

const weakTopics = [
  { topic: 'Recursion', score: 32, suggestion: 'Practice tree traversals' },
  { topic: 'Dynamic Programming', score: 28, suggestion: 'Start with memoization' },
];

const milestones = [
  { name: '100 Lessons', progress: 78, reward: '🎓' },
  { name: '30 Day Streak', progress: 40, reward: '🔥' },
  { name: 'Master Rank', progress: 15, reward: '👑' },
];

const Analysis = () => {
  const isMobile = useIsMobile();

  return (
    <ProtectedRoute>
      <MainLayout showRightSidebar={false}>
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live AI Syncing
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Analysis</h1>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/5">
              <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                Week
              </button>
              <button className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                Month
              </button>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">AI Mastery Insight</p>
                <p className="text-white font-medium leading-relaxed">
                  Based on your learning patterns, focusing on <span className="text-pink-400">System Design</span> concepts 
                  in the morning could boost your retention by 23%. Your peak focus hours are between 9-11 AM.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/5"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: `hsl(var(--primary))` }} />
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
                    <span className="text-[9px] text-emerald-400">{stat.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Daily Activity */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Daily Activity</h3>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-end justify-between h-32 gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative bg-white/[0.03] rounded-lg overflow-hidden h-full">
                      <div 
                        className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000 ${
                          i === 5 ? 'bg-gradient-to-t from-pink-500 to-orange-400' : 'bg-white/10'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-white/30">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Focus Quality */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Focus Quality</h3>
                <span className="text-emerald-400 text-sm font-bold">87%</span>
              </div>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <circle 
                      cx="50" cy="50" r="40" fill="none" 
                      stroke="url(#focusGradient)" strokeWidth="12" 
                      strokeLinecap="round"
                      strokeDasharray={`${87 * 2.51} ${100 * 2.51}`}
                    />
                    <defs>
                      <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-black text-white">87%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proficiency & Weak Topics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Proficiency Breakdown */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">Proficiency Breakdown</h3>
              <div className="space-y-4">
                {proficiencyData.map((item) => (
                  <div key={item.topic}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">{item.topic}</span>
                      <span className="text-sm font-bold text-white">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Topic Diagnostics */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Weak Topic Diagnostics
              </h3>
              <div className="space-y-3">
                {weakTopics.map((item) => (
                  <div key={item.topic} className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{item.topic}</span>
                      <span className="text-orange-400 font-bold text-sm">{item.score}%</span>
                    </div>
                    <p className="text-white/50 text-sm">{item.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
            <h3 className="text-lg font-bold text-white mb-4">Upcoming Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {milestones.map((m) => (
                <div key={m.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{m.reward}</span>
                    <span className="text-white/40 text-sm font-bold">{m.progress}%</span>
                  </div>
                  <p className="text-white font-semibold mb-2">{m.name}</p>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Path CTA */}
          <button className="w-full p-5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-between group hover:opacity-90 transition-opacity">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">Generate Custom Learning Path</p>
                <p className="text-white/70 text-sm">AI-powered personalized curriculum</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Analysis;
