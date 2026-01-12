import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ChevronRight, Play, Trophy, Beaker, Lock, GraduationCap, BadgeCheck, Rocket, Paintbrush, Heart, Plus } from 'lucide-react';
import { MOCK_REELS } from '@/data/data';

const PersonalInfoSection: React.FC = () => {
  const recentLearning = MOCK_REELS.slice(0, 2);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Activity Section */}
      <section className="p-6 md:p-8 rounded-[32px] md:rounded-[48px] bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/[0.02] to-transparent pointer-events-none" />

        <div className="relative flex items-start justify-between mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-2">Weekly Activity</h3>
            <p className="text-sm font-medium text-white/40">Minutes spent learning</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
            <span className="text-emerald-400 font-black text-sm">↑ 12%</span>
          </div>
        </div>

        <div className="h-[200px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { day: 'MON', minutes: 25 },
              { day: 'TUE', minutes: 45 },
              { day: 'WED', minutes: 30 },
              { day: 'THU', minutes: 85 },
              { day: 'FRI', minutes: 55 },
              { day: 'SAT', minutes: 65 },
              { day: 'SUN', minutes: 40 },
            ]}>
              <defs>
                <linearGradient id="colorActivity" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900, letterSpacing: '1px' }}
                dy={10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#101010', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="url(#colorActivity)"
                strokeWidth={5}
                fill="url(#fillActivity)"
                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Jump Back In */}
        <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">Jump Back In</h3>
            <button className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-400 transition-colors">View All</button>
          </div>
          <div className="space-y-4 md:space-y-6">
            {recentLearning.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden relative border border-white/10">
                    <img src={reel.thumbnail_url} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current opacity-80" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] md:text-[14px] font-bold text-white/80 group-hover:text-pink-400 transition-colors line-clamp-1">{reel.title}</h4>
                    <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest font-black mt-1">Lesson {Math.floor(Math.random() * 5) + 1} • {reel.category}</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-orange-400 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">Achievements</h3>
            <button className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-400 transition-colors">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: Trophy, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Fast Learner' },
              { icon: Beaker, color: 'text-indigo-400', bg: 'bg-indigo-500/10', label: 'Scientist' },
              { icon: Lock, color: 'text-white/20', bg: 'bg-white/5', label: 'Master', locked: true },
              { icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Brainiac' },
              { icon: Lock, color: 'text-white/20', bg: 'bg-white/5', label: 'Guru', locked: true },
              { icon: BadgeCheck, color: 'text-pink-400', bg: 'bg-pink-500/10', label: 'Verified' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${badge.bg} border border-white/5 flex items-center justify-center relative group cursor-pointer overflow-hidden`}>
                  {(() => {
                    const Icon = badge.icon;
                    return <Icon className={`w-5 h-5 md:w-6 md:h-6 ${badge.color}`} />;
                  })()}
                  {!badge.locked && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/20 text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Collections */}
      <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-white tracking-tight">My Collections</h3>
          <button className="flex items-center gap-2 px-4 md:px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105">
            <Plus className="w-3 h-3 md:w-4 md:h-4" /> New
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: 'Tech Trends', items: 12, icon: Rocket, public: true },
            { name: 'Design Inspo', items: 48, icon: Paintbrush, public: false },
            { name: 'Favorites', items: 154, icon: Heart, public: false },
          ].map((col, i) => (
            <div key={i} className="p-4 md:p-6 rounded-2xl md:rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all cursor-pointer group shadow-lg">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-pink-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                {(() => {
                  const Icon = col.icon;
                  return <Icon className="w-5 h-5 md:w-6 md:h-6" />;
                })()}
              </div>
              <h4 className="text-[14px] md:text-[15px] font-black text-white mb-1 group-hover:text-pink-400 transition-colors">{col.name}</h4>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/20">{col.items} items • {col.public ? 'Public' : 'Private'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PersonalInfoSection;
