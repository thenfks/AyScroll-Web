import React from 'react';
import { Flame, BadgeCheck } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Check if user has pro status from metadata
  const isPro = user.user_metadata?.is_pro === true;

  return (
    <header className="relative p-6 md:p-10 rounded-2xl md:rounded-[40px] bg-white/[0.03] border border-white/10 overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full p-1 md:p-1.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-orange-500 shadow-2xl">
          <img 
            src={user.user_metadata?.avatar_url} 
            className="w-full h-full rounded-full object-cover border-4 md:border-[6px] border-[#020203]" 
            alt={user.user_metadata?.name} 
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter mb-2">{user.user_metadata?.name}</h1>
          <p className="text-white/40 text-[13px] md:text-[14px] leading-relaxed max-w-md mb-4 md:mb-6 font-medium">
            Product Designer & AI Enthusiast. Learning about Quantum Computing and UI Trends. <span className="text-pink-500">@{user.user_metadata?.username}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 mb-6 md:mb-8">
            <span className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> Top Learner
            </span>
            <span className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-pink-500">
              <Flame className="w-3 h-3" /> 12 Day Streak
            </span>
            {isPro && (
              <span className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <BadgeCheck className="w-3.5 h-3.5" /> Pro Member
              </span>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
            <button className="px-6 md:px-12 py-3 md:py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-black text-white shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-[10px] md:text-[11px]">Edit Profile</button>
            <button className="px-6 md:px-12 py-3 md:py-3.5 bg-white/[0.05] border border-white/10 rounded-full font-black text-white/60 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest text-[10px] md:text-[11px]">Share Profile</button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:gap-4 relative z-10">
        <div className="px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[28px] bg-white/[0.03] border border-white/5 text-center shadow-lg min-w-[90px] md:min-w-[120px]">
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">42</p>
          <p className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.2em] mt-1 font-bold">Courses</p>
        </div>
        <div className="px-6 md:px-8 py-4 md:py-6 rounded-2xl md:rounded-[28px] bg-white/[0.03] border border-white/5 text-center shadow-lg min-w-[90px] md:min-w-[120px]">
          <p className="text-2xl md:text-3xl font-black text-white tracking-tighter">128h</p>
          <p className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.2em] mt-1 font-bold">Learned</p>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
