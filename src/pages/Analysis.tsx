import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Flame, Zap, Target, Trophy, Brain, TrendingUp, AlertTriangle, Sparkles, ChevronRight, BarChart2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GradientButton } from '@/components/ui/GradientButton';
import { cn } from '@/lib/utils';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [activityData, setActivityData] = useState([
    { day: 'MON', minutes: 0 },
    { day: 'TUE', minutes: 0 },
    { day: 'WED', minutes: 0 },
    { day: 'THU', minutes: 0 },
    { day: 'FRI', minutes: 0 },
    { day: 'SAT', minutes: 0 },
    { day: 'SUN', minutes: 0 },
  ]);

  useEffect(() => {
    if (!user) return;

    const checkSubscriptionAndFetch = async () => {
      try {
        // 1. Check Subscription
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single() as any;

        if (profileData) {
          setIsPro(profileData.subscription_tier === 'pro' || profileData.subscription_tier === 'premium');
        }

        // 2. Fetch Activity (only if needed, but we can fetch it usually or skip if locked logic is strictly enforced above. 
        // However, to keep it simple, we fetch logic here but UI handles display)

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
        const { data: activityLogs } = await supabase
          .from('daily_learning_activity')
          .select('activity_date, minutes_spent')
          .eq('user_id', user.id)
          .gte('activity_date', last7Days[0].dateStr) as any;

        // Map to chart format
        const chartData = last7Days.map(d => {
          const record = activityLogs?.find((r: any) => r.activity_date === d.dateStr);
          return {
            day: d.dayLabel,
            minutes: record ? record.minutes_spent : 0
          };
        });

        setActivityData(chartData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionAndFetch();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout showRightSidebar={false}>
          <div className="flex items-center justify-center h-[80vh]">
            <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!isPro) {
    return (
      <ProtectedRoute>
        <MainLayout showRightSidebar={false}>
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center mb-8 relative">
              <BarChart2 className="w-10 h-10 text-pink-500" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-lg shadow-lg">🔒</div>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Advanced Analytics</h1>
            <p className="text-white/40 max-w-md text-lg font-medium leading-relaxed mb-10">
              Unlock deep insights into your learning patterns, focus quality, and global ranking with AyScroll Pro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                <Target className="w-6 h-6 text-emerald-400 mb-3" />
                <h3 className="text-white font-bold mb-1">Focus Metrics</h3>
                <p className="text-white/30 text-xs">Track attention span</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                <TrendingUp className="w-6 h-6 text-orange-400 mb-3" />
                <h3 className="text-white font-bold mb-1">Learning Velocity</h3>
                <p className="text-white/30 text-xs">Measure speed of mastery</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center">
                <Brain className="w-6 h-6 text-purple-400 mb-3" />
                <h3 className="text-white font-bold mb-1">AI Diagnostics</h3>
                <p className="text-white/30 text-xs">Identify weak topics</p>
              </div>
            </div>

            <GradientButton
              onClick={() => navigate('/profile', { state: { targetTab: 'Subscription' } })}
              className="px-12 py-7 text-sm flex items-center gap-2"
            >
              Upgrade to Unlock
              <Zap className="w-4 h-4 fill-white" />
            </GradientButton>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout showRightSidebar={false}>
        <div className="max-w-5xl mx-auto">
          {/* ... Content ... */}
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
              <GradientButton
                className="px-4 py-2 text-[10px]"
                gradient="brand"
              >
                Week
              </GradientButton>
              <GradientButton
                className="px-4 py-2 text-[10px] text-white/40 hover:text-white"
                gradient="dark"
                glow={false}
              >
                Month
              </GradientButton>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-brand-gradient/10 border-pink-500/20 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1">AI Mastery Insight</p>
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
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Daily Activity</h3>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="flex-1 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorActivityAnalysis" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#f97316" />
                      </linearGradient>
                      <linearGradient id="fillActivityAnalysis" x1="0" y1="0" x2="0" y2="1">
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
                      stroke="url(#colorActivityAnalysis)"
                      strokeWidth={4}
                      fill="url(#fillActivityAnalysis)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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
          <button className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-gradient/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-xl tracking-tight">Generate Custom Learning Path</p>
                <p className="text-white/40 text-sm font-medium">AI-powered personalized curriculum</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 relative z-10" />
          </button>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Analysis;
