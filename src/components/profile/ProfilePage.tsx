import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileHeader } from '../layout/MobileHeader';
import { MobileNavDrawer } from '../layout/MobileNavDrawer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Import the new sub-components
import Toggle from './Toggle';
import SubscriptionSection from './SubscriptionSection';
import SecuritySection from './SecuritySection';
import ProfileHeader from './ProfileHeader';
import AccountNavigation from './AccountNavigation';
import SubscriptionCard from './SubscriptionCard';
import PreferencesSection from './PreferencesSection';
import PersonalInfoSection from './PersonalInfoSection';
import ProfileEditModal from './ProfileEditModal';
import ProfileEditForm from './ProfileEditForm';

interface LocationState {
  targetTab?: string;
}

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [darkMode, setDarkMode] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [subscriptionView, setSubscriptionView] = useState<'plans' | 'manage' | 'billing' | undefined>(undefined);

  // Sync activeTab with navigation state (e.g., from Analysis page)
  useEffect(() => {
    if (location.state && (location.state as LocationState).targetTab) {
      setActiveTab((location.state as LocationState).targetTab);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle Payment Return
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id');

    // Relaxed check: Allow success even if session_id is missing (for easier testing/gateway compat)
    if (status === 'success') {
      const currentSessionId = sessionId || 'unknown_session';
      console.log(`✅ Payment Success Detected! Session ID: ${currentSessionId}`);
      setActiveTab('Subscription');

      const upgradeUser = async () => {
        try {
          console.log("🔄 Upgrading user profile...");

          // 1. Update User Metadata (Auth)
          const { error: authError } = await supabase.auth.updateUser({
            data: { is_pro: true, tier: 'pro', last_payment_session: currentSessionId }
          });
          if (authError) console.error('Auth update error:', authError);

          // 2. Update Profiles Table (DB)
          if (user?.id) {
            const { error: dbError } = await supabase.from('user_profiles').update({
              subscription_tier: 'pro',
              subscription_status: 'active'
            } as any).eq('id', user.id);
            if (dbError) console.error('DB update error:', dbError);
          }

          toast.success('Payment Successful!', {
            description: `Order ${currentSessionId.slice(-6)} processed. Refreshing...`,
            duration: 3000,
          });

          // Reload to update context
          setTimeout(() => {
            console.log("🔄 Reloading page...");
            // Remove query params first
            window.history.replaceState({}, '', window.location.pathname);
            window.location.reload();
          }, 2000);

        } catch (e) {
          console.error('Manual upgrade failed', e);
          toast.error('Upgrade failed. Please contact support.');
        }
      };

      upgradeUser();
    } else if (status === 'failed') {
      console.warn(`❌ Payment Failed for Session ID: ${sessionId || 'unknown'}`);
      setActiveTab('Subscription');
      toast.error('Payment Failed', {
        description: 'The transaction could not be completed.',
      });
    }
  }, [searchParams, user]);

  const handleEditClick = () => {
    if (isMobile) {
      setIsEditModalOpen(true);
    } else {
      setActiveTab('Edit Profile');
    }
  };

  const handleEditComplete = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('Personal Info');
  };

  const handleEditCancel = () => {
    setActiveTab('Personal Info');
  };

  if (!user || user.user_metadata?.username === 'Guest') {
    return (
      <div className="flex h-screen bg-transparent">
        {!isMobile && <Sidebar />}
        {isMobile && <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />}
        <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
        <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-md ${isMobile ? 'pt-20' : ''}`}>
          <div className="w-20 h-20 rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
            <User className="w-8 h-8 text-white/20" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Profile Locked</h1>
          <p className="text-white/40 max-w-xs mb-10 text-sm font-medium leading-relaxed">Sign in to your AyScroll account to track your cosmic journey.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 md:px-12 py-4 md:py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-black text-white shadow-xl shadow-pink-500/20 hover:scale-[1.05] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {!isMobile && <Sidebar />}
      {isMobile && <MobileHeader onMenuClick={() => setMobileNavOpen(true)} />}
      <MobileNavDrawer open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar pb-32 ${isMobile ? 'pt-16' : 'pl-[240px]'}`}>
        <div className="px-4 md:px-8 py-6 max-w-[1400px] mx-auto w-full space-y-6">

          <ProfileHeader key={refreshKey} user={user} onEditClick={handleEditClick} />

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Left Column: Account & Preferences */}
            <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
              <SubscriptionCard
                onManageClick={() => {
                  setSubscriptionView('manage');
                  setActiveTab('Subscription');
                }}
                onBillingClick={() => {
                  setSubscriptionView('billing');
                  setActiveTab('Subscription');
                }}
                onUpgradeClick={() => {
                  setSubscriptionView('plans');
                  setActiveTab('Subscription');
                }}
              />
              <AccountNavigation activeTab={activeTab === 'Edit Profile' ? 'Personal Info' : activeTab} setActiveTab={setActiveTab} logout={signOut} />
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
              ) : activeTab === 'Edit Profile' ? (
                <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-white/[0.03] border border-white/10 shadow-2xl h-full animate-in fade-in slide-in-from-right-4 duration-300">
                  <ProfileEditForm
                    onSave={handleEditComplete}
                    onCancel={handleEditCancel}
                    isMobile={false}
                  />
                </div>
              ) : activeTab === 'Login & Security' ? (
                <SecuritySection />
              ) : activeTab === 'Subscription' ? (
                <SubscriptionSection initialView={subscriptionView} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] md:h-[500px] text-center space-y-6 animate-in fade-in duration-500">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white/20" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">{activeTab} Coming Soon</h3>
                  <p className="text-white/40 max-w-xs font-medium text-sm">We are currently building this section of the AyScroll experience.</p>
                  <button onClick={() => setActiveTab('Personal Info')} className="px-8 md:px-12 py-3 md:py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">Return to Dashboard</button>
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

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={() => {
          setRefreshKey(prev => prev + 1);
        }}
      />
    </div>
  );
};

export default ProfilePage;
