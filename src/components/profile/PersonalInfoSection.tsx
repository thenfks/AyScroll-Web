import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ChevronRight, Play, Trophy, Beaker, Lock, GraduationCap, BadgeCheck, Rocket, Paintbrush, Heart, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_REELS } from '@/data/data';

const PersonalInfoSection: React.FC = () => {
  const { user } = useAuth();
  const recentLearning = MOCK_REELS.slice(0, 2);
  const [activityData, setActivityData] = React.useState([
    { day: 'MON', minutes: 0 },
    { day: 'TUE', minutes: 0 },
    { day: 'WED', minutes: 0 },
    { day: 'THU', minutes: 0 },
    { day: 'FRI', minutes: 0 },
    { day: 'SAT', minutes: 0 },
    { day: 'SUN', minutes: 0 },
  ]);

  React.useEffect(() => {
    if (!user) return;

    const fetchActivity = async () => {
      // Calculate the last 7 days dynamically
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const today = new Date();
      const last7Days: { dateStr: string; dayLabel: string }[] = [];

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        last7Days.push({
          dateStr: d.toISOString().split('T')[0],
          dayLabel: days[d.getDay()],
        });
      }

      // Fetch real data
      const { data } = await supabase
        .from('daily_learning_activity')
        .select('activity_date, minutes_spent')
        .eq('user_id', user.id)
        .gte('activity_date', last7Days[0].dateStr) as { data: { activity_date: string; minutes_spent: number }[] | null };

      // Map to chart format
      const chartData = last7Days.map(d => {
        const record = data?.find(r => r.activity_date === d.dateStr);
        return {
          day: d.dayLabel,
          minutes: record ? record.minutes_spent : 0
        };
      });

      setActivityData(chartData);
    };

    fetchActivity();
  }, [user]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* Activity Section */}
      <section className="p-6 md:p-8 rounded-[32px] md:rounded-[48px] bg-secondary/30 border border-border shadow-theme-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-gradient/5 pointer-events-none" />

        <div className="relative flex items-start justify-between mb-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter mb-2">Weekly Activity</h3>
            <p className="text-sm font-medium text-muted-foreground">Minutes spent learning</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
            <span className="text-green-500 font-black text-sm">↑ 12%</span>
          </div>
        </div>

        <div className="h-[200px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
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
                tick={{ fill: 'hsl(var(--muted-foreground))', opacity: 0.5, fontSize: 10, fontWeight: 900, letterSpacing: '1px' }}
                dy={10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="url(#colorActivity)"
                strokeWidth={5}
                fill="url(#fillActivity)"
                activeDot={{ r: 8, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Jump Back In */}
        <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-secondary/30 border border-border shadow-theme-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight">Jump Back In</h3>
            <button className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-colors">View All</button>
          </div>
          <div className="space-y-4 md:space-y-6">
            {recentLearning.map((reel) => (
              <div key={reel.id} className="group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden relative border border-border">
                    <img src={reel.thumbnail_url} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-current opacity-80" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] md:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{reel.title}</h4>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black mt-1">Lesson {Math.floor(Math.random() * 5) + 1} • {reel.category}</p>
                  </div>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-secondary/30 border border-border shadow-theme-md">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight">Achievements</h3>
            <button className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-colors">See All</button>
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Fast Learner' },
              { icon: Beaker, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Scientist' },
              { icon: Lock, color: 'text-muted-foreground/20', bg: 'bg-muted', label: 'Master', locked: true },
              { icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Brainiac' },
              { icon: Lock, color: 'text-muted-foreground/20', bg: 'bg-muted', label: 'Guru', locked: true },
              { icon: BadgeCheck, color: 'text-primary', bg: 'bg-primary/10', label: 'Verified' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${badge.bg} border border-border flex items-center justify-center relative group cursor-pointer overflow-hidden`}>
                  {(() => {
                    const Icon = badge.icon;
                    return <Icon className={`w-5 h-5 md:w-6 md:h-6 ${badge.color}`} />;
                  })()}
                  {!badge.locked && <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                </div>
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Collections */}
      <section className="p-4 md:p-6 rounded-2xl md:rounded-[40px] bg-secondary/30 border border-border shadow-theme-md">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-bold text-foreground tracking-tight">My Collections</h3>
          <button className="flex items-center gap-2 px-4 md:px-6 py-2 bg-brand-gradient rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105">
            <Plus className="w-3 h-3 md:w-4 md:h-4" /> New
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: 'Tech Trends', items: 12, icon: Rocket, public: true },
            { name: 'Design Inspo', items: 48, icon: Paintbrush, public: false },
            { name: 'Favorites', items: 154, icon: Heart, public: false },
          ].map((col, i) => (
            <div key={i} className="p-4 md:p-6 rounded-2xl md:rounded-[32px] bg-secondary/50 border border-border hover:bg-secondary/80 transition-all cursor-pointer group shadow-lg">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-secondary flex items-center justify-center text-primary mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                {(() => {
                  const Icon = col.icon;
                  return <Icon className="w-5 h-5 md:w-6 md:h-6" />;
                })()}
              </div>
              <h4 className="text-[14px] md:text-[15px] font-black text-foreground mb-1 group-hover:text-primary transition-colors">{col.name}</h4>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">{col.items} items • {col.public ? 'Public' : 'Private'}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PersonalInfoSection;
