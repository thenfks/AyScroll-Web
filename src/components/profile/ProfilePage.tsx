import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { User, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Import the new sub-components
import Toggle from './Toggle';
import SubscriptionSection from './SubscriptionSection';
import SecuritySection from './SecuritySection';
import ProfileHeader from './ProfileHeader';
import AccountNavigation from './AccountNavigation';
import PreferencesSection from './PreferencesSection';
import PersonalInfoSection from './PersonalInfoSection';

interface LocationState {
  targetTab?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);

  // Sync activeTab with navigation state (e.g., from Analysis page)
  useEffect(() => {
    if (location.state && (location.state as LocationState).targetTab) {
      setActiveTab((location.state as LocationState).targetTab);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!user || user.user_metadata?.username === 'Guest') {
    return (
      <div className="flex h-screen bg-transparent">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-md">
          <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
            <User className="w-8 h-8 text-white/20" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Profile Locked</h1>
          <p className="text-white/40 max-w-xs mb-10 text-sm font-medium leading-relaxed">Sign in to your AyScroll account to track your cosmic journey.</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-12 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-black text-white shadow-xl shadow-pink-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar pb-32 pl-[240px]">
        <div className="px-6 md:px-12 py-10 max-w-[1400px] mx-auto w-full space-y-8">
          
          <ProfileHeader user={user} />

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Account & Preferences */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <AccountNavigation activeTab={activeTab} setActiveTab={setActiveTab} logout={logout} />
              <PreferencesSection 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                autoDownload={autoDownload} 
                setAutoDownload={setAutoDownload} 
              />
            </div>

            {/* Right Column: Content Dashboard */}
            <div className="col-span-12 lg:col-span-8">
              {activeTab === 'Personal Info' ? (
                <PersonalInfoSection />
              ) : activeTab === 'Login & Security' ? (
                <SecuritySection />
              ) : activeTab === 'Subscription' ? (
                <SubscriptionSection />
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6 animate-in fade-in duration-500">
                   <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-8 h-8 text-white/20" />
                   </div>
                   <h3 className="text-2xl font-black text-white tracking-tight">{activeTab} Coming Soon</h3>
                   <p className="text-white/40 max-w-xs font-medium text-sm">We are currently building this section of the AyScroll experience.</p>
                   <button onClick={() => setActiveTab('Personal Info')} className="px-12 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">Return to Dashboard</button>
                </div>
              )}
            </div>
          </div>
          {/* Copyright Notice */}
          <div className="text-center text-white/30 text-xs mt-10">
            &copy; Ayscroll 2025-2026. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;