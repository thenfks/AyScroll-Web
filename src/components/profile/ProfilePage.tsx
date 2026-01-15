import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';
import { MobileHeader } from '../layout/MobileHeader';
import { MobileNavDrawer } from '../layout/MobileNavDrawer';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import the new sub-components
import Toggle from './Toggle';
import SubscriptionSection from './SubscriptionSection';
import SecuritySection from './SecuritySection';
import ProfileHeader from './ProfileHeader';
import AccountNavigation from './AccountNavigation';
import SubscriptionCard from './SubscriptionCard';
import PreferencesSection from './PreferencesSection';
import MinimalistMobileAccount from './MinimalistMobileAccount';
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
  const { isDark, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Personal Info');
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const processedRef = React.useRef<string | null>(null);

  useEffect(() => {
    // Re-fetch profile data on window focus to handle back-button navigation after cancellation
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1);

      // Check for pending transaction flag - this means user hit back button or closed tab
      const isProcessing = sessionStorage.getItem('is_processing_payment');
      if (isProcessing) {
        console.warn("⚠️ Payment Abandoned: User navigated back without completion.");
        sessionStorage.removeItem('is_processing_payment');

        const realCheckoutId = sessionStorage.getItem('pending_checkout_id');
        sessionStorage.removeItem('pending_checkout_id');

        // Manually trigger the cancellation flow by setting params
        // This ensures the user sees the feedback and the system logs it
        setSearchParams({
          status: 'cancelled',
          session_id: realCheckoutId || 'abandoned_' + Date.now(),
          plan_id: 'pro' // We can improve this if we stored plan_id, but generic fallback is okay
        });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [setSearchParams]);

  useEffect(() => {
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id') || 'unknown';
    const paramsKey = `${status}-${sessionId}`;

    if (!status || processedRef.current === paramsKey) return;

    // WAIT for user to be loaded for success path
    if (status === 'success' && !user) return;

    // Mark as processed immediately
    processedRef.current = paramsKey;

    if (status === 'success') {
      const currentSessionId = sessionId === 'unknown' ? `SESS-${Date.now().toString().slice(-6)}` : sessionId;
      const planId = searchParams.get('plan_id') || 'pro';
      const amount = searchParams.get('amount') || '499';
      const cycle = searchParams.get('cycle') || 'Monthly';
      const planLabel = `AyScroll ${planId.charAt(0).toUpperCase() + planId.slice(1)} (${cycle})`;

      console.log(`✅ Payment Success Detected! Session ID: ${currentSessionId}`);
      setActiveTab('Subscription');

      const upgradeUser = async () => {
        try {
          // Clear query params via React Router state
          setSearchParams({}, { replace: true });

          console.log(`[UPGRADE] Starting upgrade for ${planId}...`);
          const normalizedPlanId = planId.toLowerCase() as any;

          // 1. Update User Metadata (Auth)
          const { error: authError } = await supabase.auth.updateUser({
            data: { is_pro: true, tier: normalizedPlanId, last_payment_session: currentSessionId }
          });
          if (authError) console.error('[UPGRADE] Auth Meta Error:', authError);

          // 2. Update Profiles Table (DB)
          if (user?.id) {
            const startDate = new Date();
            const endDate = new Date();
            if (cycle === 'Annual') {
              endDate.setFullYear(startDate.getFullYear() + 1);
            } else {
              endDate.setMonth(startDate.getMonth() + 1);
            }

            console.log(`[UPGRADE] Writing to DB. Tier: ${normalizedPlanId}, Dates: ${startDate.toISOString()} -> ${endDate.toISOString()}`);

            const { error: dbError } = await supabase.from('user_profiles').update({
              subscription_tier: normalizedPlanId,
              subscription_status: 'active',
              subscription_start_date: startDate.toISOString(),
              subscription_end_date: endDate.toISOString()
            } as any).eq('id', user.id) as any;

            if (dbError) {
              console.error('[UPGRADE] DB Update Error:', dbError);
              toast({
                title: "Database Update Failed",
                description: `Supabase Error: ${dbError.message || 'Permission Denied'}. Please check RLS policies.`,
                variant: "destructive"
              });
              return;
            } else {
              console.log('✅ [UPGRADE] User profile successfully updated in DB.');
            }

            // 3. Log to Billing History (Frontend Fallback)
            try {
              const { error: billingError } = await supabase.from('billing_history').insert({
                user_id: user.id,
                plan_name: planLabel,
                amount: `₹${amount}`,
                status: 'Paid',
                invoice_id: currentSessionId
              } as any);
              if (billingError) console.error('[UPGRADE] Billing log error:', billingError);
              else console.log('✅ [UPGRADE] Billing history record created.');
            } catch (err) {
              console.error('[UPGRADE] Catch billing log error:', err);
            }
          }

          // 4. Trigger Subscription Email (Frontend Fallback)
          try {
            await supabase.functions.invoke('subscription-emails', {
              body: {
                type: 'upgrade',
                email: user.email,
                userName: user.user_metadata?.full_name || 'User',
                planName: planLabel,
                price: `₹${amount}`,
                invoiceId: currentSessionId,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }
            });
            console.log('✅ [UPGRADE] Success email triggered from frontend.');
          } catch (emailErr) {
            console.error('[UPGRADE] Failed to trigger success email:', emailErr);
          }

          // 5. Refresh session to update UI
          await supabase.auth.refreshSession();

          // Re-fetch profile data to be absolutely sure
          const { data: updatedProfile } = await supabase
            .from('user_profiles')
            .select('subscription_tier, subscription_status')
            .eq('id', user?.id)
            .maybeSingle();

          console.log('[UPGRADE] Verification Check:', updatedProfile);

          toast({
            title: 'Welcome to ' + (normalizedPlanId === 'go' ? 'Go!' : 'Pro!'),
            description: `Your subscription is now active. Order ID: ${currentSessionId.slice(-8)}`,
            variant: 'success',
          });

        } catch (e) {
          console.error('[UPGRADE] Manual process failed', e);
          toast({
            title: 'Critical Error',
            description: 'The upgrade process crashed. Refreshing page...',
            variant: 'destructive',
          });
          setTimeout(() => window.location.reload(), 2000);
        }
      };

      upgradeUser();
    } else if (status === 'failed' || status === 'cancelled') {
      const currentSessionId = sessionId || `SESS-ERR-${Date.now().toString().slice(-6)}`;
      const planId = searchParams.get('plan_id') || 'pro';
      const amount = searchParams.get('amount');
      const cycle = searchParams.get('cycle') || 'Monthly';
      const planLabel = `AyScroll ${planId.charAt(0).toUpperCase() + planId.slice(1)} (${cycle})`;

      console.warn(`❌ Payment ${status.toUpperCase()} for Session ID: ${currentSessionId}`);
      setActiveTab('Subscription');

      // Clear params
      setSearchParams({}, { replace: true });

      // Log the interrupted/cancelled transaction to history and send email
      const handleAbortedPayment = async () => {
        if (user?.id) {
          try {
            // 1. Log to history
            const { error: billingError } = await supabase.from('billing_history').insert({
              user_id: user.id,
              plan_name: planLabel,
              amount: '₹0',
              status: status === 'cancelled' ? 'Cancelled' : 'Interrupted',
              invoice_id: currentSessionId
            } as any);
            if (billingError) console.error('Aborted payment log error:', billingError);
            else console.log('✅ Aborted payment recorded');

            // 2. Trigger appropriate email
            await supabase.functions.invoke('subscription-emails', {
              body: {
                type: status === 'cancelled' ? 'interrupted' : 'failed',
                email: user.email,
                userName: user.user_metadata?.full_name || 'User',
                planName: planId.charAt(0).toUpperCase() + planId.slice(1),
                price: amount ? `₹${amount}` : undefined
              }
            });
            console.log(`✅ ${status} email triggered`);
          } catch (err) {
            console.error('Error handling aborted payment email:', err);
          }
        }
      };

      handleAbortedPayment();

      toast({
        title: status === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed',
        description: status === 'cancelled' ? 'You have cancelled the payment process. Check your email for more info.' : 'The transaction could not be completed.',
        variant: 'destructive',
      });
    }
  }, [searchParams, user, setSearchParams]);

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
        <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center bg-background/20 backdrop-blur-md ${isMobile ? 'pt-20' : ''}`}>
          <div className="w-20 h-20 rounded-[32px] bg-secondary/50 border border-border flex items-center justify-center mb-8 shadow-theme-lg">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3 tracking-tight">Profile Locked</h1>
          <p className="text-muted-foreground max-w-xs mb-10 text-sm font-medium leading-relaxed">Sign in to your AyScroll account to track your cosmic journey.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 md:px-12 py-4 md:py-5 bg-brand-gradient rounded-2xl font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
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

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto no-scrollbar ${isMobile ? 'pt-24' : 'pl-[240px]'}`}>
        <div className={`flex-1 max-w-[1400px] mx-auto w-full ${isMobile ? 'px-3 py-4 space-y-4' : 'px-4 md:px-8 py-6 space-y-6'}`}>

          <ProfileHeader key={refreshKey} user={user} onEditClick={handleEditClick} />

          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* Left Column: Account & Preferences */}
            <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
              {!isMobile && (
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
              )}
              {!isMobile && (
                <>
                  <AccountNavigation activeTab={activeTab === 'Edit Profile' ? 'Personal Info' : activeTab} setActiveTab={setActiveTab} logout={signOut} />
                  <PreferencesSection
                    darkMode={isDark}
                    setDarkMode={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                    autoDownload={autoDownload}
                    setAutoDownload={setAutoDownload}
                  />
                </>
              )}
            </div>

            {/* Right Column: Content Dashboard */}
            <div className="col-span-12 lg:col-span-8">
              {activeTab === 'Personal Info' ? (
                <PersonalInfoSection />
              ) : activeTab === 'Edit Profile' ? (
                <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] bg-secondary/30 border border-border shadow-theme-lg h-full animate-in fade-in slide-in-from-right-4 duration-300">
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
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-secondary/50 border border-border flex items-center justify-center shadow-theme-lg">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight">{activeTab} Coming Soon</h3>
                  <p className="text-muted-foreground max-w-xs font-medium text-sm">We are currently building this section of the AyScroll experience.</p>
                  <button onClick={() => setActiveTab('Personal Info')} className="px-8 md:px-12 py-3 md:py-3.5 bg-brand-gradient rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Return to Dashboard</button>
                </div>
              )}

              {isMobile && (
                <div className="mt-5">
                  <MinimalistMobileAccount
                    activeTab={activeTab === 'Edit Profile' ? 'Personal Info' : activeTab}
                    setActiveTab={setActiveTab}
                    darkMode={isDark}
                    setDarkMode={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                    autoDownload={autoDownload}
                    setAutoDownload={setAutoDownload}
                    logout={signOut}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Copyright Notice - Now at Absolute Bottom */}
        <div className="mt-auto pb-10 pt-10 text-center border-t border-border mx-8 shrink-0">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide">
            &copy; Ayscroll 2025-2026. All rights reserved.
          </p>
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
