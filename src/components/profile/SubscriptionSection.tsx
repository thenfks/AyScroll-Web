import React, { useState, useEffect } from 'react';
import { Check, FileText, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { initiateCheckout } from '@/lib/payment';
import { supabase } from '@/integrations/supabase/client';
import ManageSubscription from './ManageSubscription';
import BillingInfo from './BillingInfo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SubscriptionSectionProps {
  initialView?: 'plans' | 'manage' | 'billing';
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({ initialView }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'Annual' | 'Monthly'>('Annual');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [searchParams] = useSearchParams();
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [dbTier, setDbTier] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isPro = dbTier === 'pro' || dbTier === 'premium' || dbTier === 'go';
  const [view, setView] = useState<'plans' | 'manage' | 'billing'>(initialView || 'plans');

  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) {
        setLoadingStatus(false); // Ensure loading status is set to false if no user
        return;
      }

      try {
        // Fetch profile to verify tier
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single() as any;

        if (profile) {
          const tier = profile.subscription_tier;
          setDbTier(tier);

          const actuallyPro = tier === 'pro' || tier === 'premium' || tier === 'go';

          // Only auto-switch view if no initialView was provided
          if (!initialView) {
            setView(actuallyPro ? 'manage' : 'plans');
          }
        }
      } catch (err) {
        console.error("Error fetching status:", err);
      } finally {
        setLoadingStatus(false);
      }

      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBillingHistory(data);
      }
      setLoadingHistory(false);
    };

    fetchStatus();
  }, [user, initialView]);

  const handleUpgrade = async (planName: string, price: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to upgrade your plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpgrading(true);

    const amountInRupees = parseInt(price.replace(/[^0-9]/g, ''));

    await initiateCheckout({
      planId: planName.toLowerCase(),
      amount: amountInRupees,
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || 'User',
      billingCycle
    });

    setIsUpgrading(false);
  };

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: '/forever',
      description: 'Perfect for casual learners',
      features: [
        'Access to all free lessons',
        'Basic flashcards',
        'Community channels',
        'Access to Various Topics',
        'Progress Tracker',
        'Mobile & web access'
      ],
      cta: isPro ? 'Current Plan' : 'Start Free',
      active: !isPro,
      badge: !isPro ? 'Active' : null,
      disabled: isPro
    },
    {
      name: 'Pro',
      price: billingCycle === 'Annual' ? '399' : '499',
      originalPrice: billingCycle === 'Annual' ? '499' : null,
      period: '/month',
      description: 'For serious students',
      features: [
        'Unlimited lesson access',
        'AI-powered recommendations',
        'Advanced analytics',
        'Spaced repetition flashcards',
        'Offline download',
        'Priority support',
        'Ad-free experience'
      ],
      cta: isPro ? 'Current Plan' : isUpgrading ? 'Processing...' : 'Get Pro',
      popular: true,
      badge: isPro ? 'Active' : 'Most Popular',
      highlight: true,
      onClick: isPro ? undefined : () => handleUpgrade('Pro', billingCycle === 'Annual' ? '399' : '499'),
      disabled: isPro
    },
    {
      name: 'Go',
      price: billingCycle === 'Annual' ? '249' : '299',
      originalPrice: billingCycle === 'Annual' ? '299' : null,
      period: '/month',
      description: 'For Topic Specific Learning',
      features: [
        'Access to 10 Topics',
        'AI-powered recommendations',
        'Weak Topic analytics',
        'Custom learning paths',
        'Custom/ AI-powered flashcards',
        'Offline support',
        'Progress Tracker'
      ],
      cta: isPro ? 'Switch Plan' : 'Get Started',
      badge: 'Popular',
      onClick: isPro ? undefined : () => handleUpgrade('Go', billingCycle === 'Annual' ? '249' : '299')
    }
  ];

  const handleCancel = async () => {
    if (loadingStatus) return;

    // Robust check for Pro status
    if (!isPro) {
      toast({
        title: 'Action Denied',
        description: "You don't have an active Pro subscription to cancel.",
        variant: 'destructive',
      });
      return;
    }

    setShowCancelDialog(true);
  };

  const executeCancel = async () => {
    const { dismiss: dismissLoading } = toast({
      title: "Canceling subscription...",
      description: "Moving your account to the Free plan.",
      variant: "loading"
    });
    console.log("Starting cancellation for user:", user?.id);

    try {
      // 1. Update Auth User Metadata as a courtesy, but DB is primary
      const { error: authError } = await supabase.auth.updateUser({
        data: { is_pro: false, tier: 'free' }
      });

      if (authError) throw authError;
      console.log("Auth metadata updated successfully");

      // 2. Update DB Profile
      if (user?.id) {
        const { error: dbError } = await supabase.from('user_profiles').update({
          subscription_tier: 'free',
          subscription_status: 'cancelled'
        } as any).eq('id', user.id) as any;

        if (dbError) throw dbError;
        console.log("DB profile updated successfully");

        // 3. Log Cancellation to History
        await supabase.from('billing_history').insert({
          user_id: user.id,
          plan_name: 'AyScroll Pro (Monthly)',
          amount: '₹0',
          status: 'Cancelled',
          invoice_id: `CAN-${Date.now().toString().slice(-6)}`
        } as any);

        // 4. Trigger Downgrade Email
        try {
          await supabase.functions.invoke('subscription-emails', {
            body: {
              type: 'downgrade',
              email: user.email,
              userName: user.user_metadata?.full_name || 'User',
              planName: 'Pro'
            }
          });
          console.log("Cancellation email triggered");
        } catch (emailErr) {
          console.error("Failed to send cancellation email", emailErr);
        }
      }

      // 4. Force session refresh to update local context
      await supabase.auth.refreshSession();

      dismissLoading();
      toast({
        title: 'Subscription Canceled',
        description: 'Your account has been moved to the Free plan.',
        variant: 'success',
      });

      // Reload after a short delay to ensure everything is synced
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (e: any) {
      console.error("Cancel failed:", e);
      dismissLoading();
      toast({
        title: 'Cancellation Failed',
        description: e.message || "Please try again or contact support.",
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {view === 'plans' ? (
        <>
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Choose Your Subscription</h3>

            <div className="flex bg-[#101010] p-1.5 rounded-xl border border-white/5 shadow-inner">
              {(['Annual', 'Monthly'] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-6 md:px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === cycle ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-white/30 hover:text-white/60'}`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 md:p-8 rounded-[32px] flex flex-col transition-all duration-300 border hover:scale-[1.03] ${plan.highlight
                  ? 'bg-[#151515] border-white/10 shadow-2xl shadow-orange-500/5'
                  : 'bg-[#101010] border-white/5 hover:border-white/10'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 border border-white/10">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.badge && plan.badge !== 'Most Popular' && plan.name !== 'Go' && (
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${plan.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.active ? 'bg-emerald-400' : 'bg-orange-400'}`}></div> {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`text-center mb-8 pt-4 ${plan.popular ? 'mt-2' : ''}`}>
                  <h4 className={`text-2xl font-black mb-2 text-white`}>{plan.name}</h4>
                  <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-6 min-h-[16px]">{plan.description}</p>

                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-white self-start mt-2">₹</span>
                    <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                    <div className="flex flex-col items-start ml-2 text-left">
                      {plan.originalPrice && <span className="text-sm text-white/30 line-through font-bold">₹{plan.originalPrice}</span>}
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex-1 mb-8 px-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-gradient-to-br from-pink-500/20 to-orange-500/20 text-orange-400' : 'bg-white/5 text-white/40'}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={`text-[13px] font-medium leading-tight ${plan.highlight ? 'text-white/80' : 'text-white/60'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={plan.onClick}
                  disabled={plan.disabled && plan.name !== 'Go'}
                  className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] ${plan.disabled && plan.name !== 'Go'
                    ? 'bg-white/5 text-white/20 cursor-default border border-white/5'
                    : plan.highlight
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-white/10 hover:bg-white/20 border border-white/5'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : view === 'manage' ? (
        <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ManageSubscription
            tier={dbTier || 'free'}
            status={isPro ? 'active' : (billingHistory[0]?.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'inactive')}
            onViewPlans={() => setView('plans')}
            onBillingClick={() => setView('billing')}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <BillingInfo onBack={() => setView('manage')} />
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your Pro subscription? You will lose access to Pro features immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Membership</AlertDialogCancel>
            <AlertDialogAction onClick={executeCancel}>
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Billing History Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Billing History
          </h3>

          {isPro && (
            <button
              onClick={handleCancel}
              className="text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
            >
              Cancel Subscription
            </button>
          )}
        </div>

        <div className="bg-[#101010] border border-white/5 rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Date</th>
                  <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Plan</th>
                  <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Amount</th>
                  <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold text-white/40 uppercase tracking-widest text-[10px] text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20 font-medium font-bold uppercase tracking-widest text-[10px]">Loading history...</td>
                  </tr>
                ) : billingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20 font-medium font-bold uppercase tracking-widest text-[10px]">No transaction records found.</td>
                  </tr>
                ) : (
                  billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-white/80 font-medium">{new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-white/80">{invoice.plan_name}</td>
                      <td className="px-6 py-4 text-white/80">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const status = (invoice.status || '').toLowerCase();
                          let colors = "bg-slate-500/10 text-slate-400 border-slate-500/20";

                          if (status === 'paid' || status === 'active') colors = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                          if (status === 'cancelled' || status === 'canceled' || status === 'failed') colors = "bg-red-500/10 text-red-400 border-red-500/20";
                          if (status === 'interrupted' || status === 'pending') colors = "bg-orange-500/10 text-orange-400 border-orange-500/20";

                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors}`}>
                              {invoice.status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-white/40 hover:text-orange-500 transition-colors inline-flex items-center gap-1.5 text-xs font-medium group">
                          <span>Download</span>
                          <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
