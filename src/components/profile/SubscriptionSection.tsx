import React, { useState, useEffect } from 'react';
import { Check, FileText, Download, X, Printer, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GradientButton } from '@/components/ui/GradientButton';
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
  const [showClearHistoryDialog, setShowClearHistoryDialog] = useState(false);

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

      try {
        // Attempt fetch with sort
        let { data, error } = await supabase
          .from('billing_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fallback if created_at is missing or other sort error
        if (error && (error.message.includes('created_at') || error.code === '42703')) {
          console.warn("Sorting by created_at failed, falling back to unsorted fetch.");
          const fallback = await supabase
            .from('billing_history')
            .select('*')
            .eq('user_id', user.id);
          data = fallback.data;
          error = fallback.error;
        }

        if (error) {
          console.error("Billing history fetch error:", error);
        } else if (data) {
          setBillingHistory(data);
        }
      } catch (err) {
        console.error("Catch billing history error:", err);
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

    const targetMonthlyPrice = parseInt(price.replace(/[^0-9]/g, ''));
    let totalAmount = billingCycle === 'Annual' ? targetMonthlyPrice * 12 : targetMonthlyPrice;

    // Smart Recalculation: If upgrading from Go to Pro
    if (dbTier === 'go' && planName.toLowerCase() === 'pro') {
      const currentGoPrice = billingCycle === 'Annual' ? 249 * 12 : 299;
      const difference = totalAmount - currentGoPrice;

      console.log(`Recalculating Upgrade: Pro (${totalAmount}) - Go (${currentGoPrice}) = ${difference}`);

      // Ensure we don't charge negative (though unlikely with these prices)
      totalAmount = Math.max(0, difference);

      toast({
        title: "Upgrade Recalculated",
        description: `Upgrading to Pro for only ₹${totalAmount} (Difference adjusted).`,
        variant: "success"
      });
    }

    await initiateCheckout({
      planId: planName.toLowerCase(),
      amount: totalAmount,
      userId: user.id,
      userEmail: user.email || '',
      userName: user.user_metadata?.full_name || 'User',
      billingCycle,
      metadata: {
        payment_type: user.user_metadata?.payment_type,
        upi_id: user.user_metadata?.upi_id,
        card_last4: user.user_metadata?.card_last4,
        card_expiry: user.user_metadata?.card_expiry
      }
    });

    setIsUpgrading(false);
  };

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleDownloadInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    toast({
      title: "Opening Invoice",
      description: `Viewing receipt for ${invoice.plan_name}...`,
      variant: "success"
    });
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    const { dismiss: dismissLoading } = toast({
      title: "Deleting record...",
      description: "Removing billing entry from your history.",
      variant: "loading"
    });

    try {
      const { error } = await supabase
        .from('billing_history')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      // Update UI locally
      setBillingHistory(prev => prev.filter(item => item.id !== invoiceId));

      dismissLoading();
      toast({
        title: "Record Deleted",
        description: "The transaction entry has been removed.",
        variant: "success"
      });
    } catch (err: any) {
      console.error("Delete history error:", err);
      dismissLoading();
      toast({
        title: "Delete Failed",
        description: err.message || "Could not remove the record.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllHistory = () => {
    if (billingHistory.length === 0) return;
    setShowClearHistoryDialog(true);
  };

  const executeClearHistory = async () => {
    setShowClearHistoryDialog(false);
    const { dismiss: dismissLoading } = toast({
      title: "Clearing history...",
      description: "Removing all billing records from our database.",
      variant: "loading"
    });

    try {
      const { error } = await supabase
        .from('billing_history')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update UI locally
      setBillingHistory([]);

      dismissLoading();
      toast({
        title: "History Cleared",
        description: "All transaction records have been permanently removed from Supabase.",
        variant: "success"
      });
    } catch (err: any) {
      console.error("Clear history error:", err);
      dismissLoading();
      toast({
        title: "Action Failed",
        description: err.message || "Could not clear history.",
        variant: "destructive"
      });
    }
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
      cta: dbTier === 'free' ? 'Current Plan' : 'Start Free',
      active: dbTier === 'free',
      badge: dbTier === 'free' ? 'Active' : null,
      disabled: dbTier === 'free' || isPro
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
      cta: dbTier === 'pro' ? 'Current Plan' : isUpgrading ? 'Proceed to Payment Gateway' : isPro ? 'Switch Plan' : 'Get Pro',
      popular: true,
      badge: dbTier === 'pro' ? 'Active' : 'Most Popular',
      highlight: true,
      onClick: dbTier === 'pro' ? undefined : () => handleUpgrade('Pro', billingCycle === 'Annual' ? '399' : '499'),
      disabled: dbTier === 'pro'
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
      cta: dbTier === 'go' ? 'Current Plan' : isUpgrading ? 'Proceed to Payment Gateway' : (dbTier === 'pro' || dbTier === 'premium') ? 'Plan Active' : 'Get Go',
      badge: 'Popular',
      highlight: true,
      onClick: (dbTier === 'go' || dbTier === 'pro' || dbTier === 'premium') ? undefined : () => handleUpgrade('Go', billingCycle === 'Annual' ? '249' : '299'),
      disabled: dbTier === 'go' || dbTier === 'pro' || dbTier === 'premium'
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
            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter">Choose Your Subscription</h3>

            <div className="flex bg-secondary p-1.5 rounded-xl border border-border shadow-inner">
              {(['Annual', 'Monthly'] as const).map((cycle) => (
                <GradientButton
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  gradient={billingCycle === cycle ? 'brand' : 'dark'}
                  glow={billingCycle === cycle}
                  className={cn(
                    "px-6 md:px-8 py-2.5 text-[10px] uppercase tracking-widest",
                    billingCycle !== cycle && "border-transparent bg-transparent hover:bg-secondary-foreground/5"
                  )}
                >
                  {cycle}
                </GradientButton>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 md:p-8 rounded-[32px] flex flex-col transition-all duration-300 border hover:scale-[1.03] ${plan.highlight
                  ? 'bg-card border-primary/20 shadow-theme-lg shadow-primary/5'
                  : 'bg-secondary/30 border-border hover:border-primary/20'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-brand-gradient text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 border border-primary/20">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.badge && plan.badge !== 'Most Popular' && plan.name !== 'Go' && (
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${plan.active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.active ? 'bg-green-500' : 'bg-orange-500'}`}></div> {plan.badge}
                    </span>
                  </div>
                )}

                <div className={`text-center mb-8 pt-4 ${plan.popular ? 'mt-2' : ''}`}>
                  <h4 className={`text-2xl font-black mb-2 text-foreground`}>{plan.name}</h4>
                  <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-6 min-h-[16px]">{plan.description}</p>

                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-black text-foreground self-start mt-2">₹</span>
                    <span className="text-6xl font-black text-foreground tracking-tighter">{plan.price}</span>
                    <div className="flex flex-col items-start ml-2 text-left">
                      {plan.originalPrice && <span className="text-sm text-muted-foreground/50 line-through font-bold">₹{plan.originalPrice}</span>}
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex-1 mb-8 px-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className={`text-[13px] font-medium leading-tight ${plan.highlight ? 'text-foreground/80' : 'text-muted-foreground/80'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <GradientButton
                  onClick={plan.onClick}
                  disabled={plan.disabled && plan.name !== 'Go'}
                  gradient={plan.disabled && plan.name !== 'Go' ? 'dark' : (plan.highlight ? 'brand' : 'dark')}
                  glow={plan.highlight && !(plan.disabled && plan.name !== 'Go')}
                  className={cn(
                    "w-full py-6 text-[11px]",
                    plan.disabled && plan.name !== 'Go' && "opacity-50 cursor-default"
                  )}
                >
                  {plan.cta}
                </GradientButton>
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

      <AlertDialog open={showClearHistoryDialog} onOpenChange={setShowClearHistoryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Billing History?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete your entire billing history from our database? This action cannot be revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeClearHistory}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Billing History Section */}
      <div className="max-w-7xl mx-auto mt-20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Billing History
          </h3>

          {billingHistory.length > 0 && (
            <button
              onClick={handleClearAllHistory}
              className="text-xs font-bold text-destructive hover:opacity-80 transition-colors"
            >
              Clear All History
            </button>
          )}
        </div>

        <div className="bg-secondary/30 border border-border rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Date</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Plan</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Amount</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-widest text-[10px] text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingHistory ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground/50 font-medium font-bold uppercase tracking-widest text-[10px]">Loading history...</td>
                  </tr>
                ) : billingHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground/50 font-medium font-bold uppercase tracking-widest text-[10px]">No transaction records found.</td>
                  </tr>
                ) : (
                  billingHistory.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-6 py-4 text-foreground/80 font-medium">{new Date(invoice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-6 py-4 text-foreground/80">{invoice.plan_name}</td>
                      <td className="px-6 py-4 text-foreground/80">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        {(() => {
                          const status = (invoice.status || '').toLowerCase();
                          let colors = "bg-muted text-muted-foreground border-border";

                          if (status === 'paid' || status === 'active') colors = "bg-green-500/10 text-green-500 border-green-500/20";
                          if (status === 'cancelled' || status === 'canceled' || status === 'failed') colors = "bg-red-500/10 text-red-500 border-red-500/20";
                          if (status === 'interrupted' || status === 'pending') colors = "bg-orange-500/10 text-orange-500 border-orange-500/20";

                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors}`}>
                              {invoice.status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 text-xs font-medium group"
                          >
                            <span>Download</span>
                            <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 group"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedInvoice(null)}
          />
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-[40px] shadow-theme-lg overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient p-[1px]">
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">Invoice Receipt</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transaction Statement</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Invoice ID</p>
                    <p className="text-sm font-bold text-foreground font-mono uppercase">{selectedInvoice.invoice_id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Date Processed</p>
                    <p className="text-sm font-bold text-foreground">
                      {new Date(selectedInvoice.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="mb-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Status</p>
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${selectedInvoice.status?.toLowerCase() === 'paid'
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                      }`}>
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] bg-secondary/50 border border-border p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <p className="text-sm font-bold text-muted-foreground">Subscription Plan</p>
                  <p className="text-sm font-bold text-foreground">{selectedInvoice.plan_name}</p>
                </div>
                <div className="flex justify-between items-center text-2xl">
                  <p className="font-black text-muted-foreground uppercase tracking-tighter">Total Amount</p>
                  <p className="font-black text-foreground">{selectedInvoice.amount}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => window.print()}
                  className="w-full py-4 bg-secondary border border-border rounded-2xl font-black text-foreground uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all font-bold"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <p className="text-center text-[10px] font-medium text-muted-foreground">
                  This is a digital receipt for your cosmic journey at AyScroll.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSection;
