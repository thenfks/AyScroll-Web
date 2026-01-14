import React from 'react';
import {
    ShieldCheck,
    Calendar,
    CreditCard,
    ArrowRightLeft,
    XCircle,
    Download,
    AlertCircle,
    Receipt,
    Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ManageSubscriptionProps {
    tier: string;
    status: string;
    onViewPlans: () => void;
    onBillingClick: () => void;
    onCancel: () => void;
}

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({ tier, status, onViewPlans, onBillingClick, onCancel }) => {
    const { user } = useAuth();
    const isPro = tier?.toLowerCase() === 'pro' || tier?.toLowerCase() === 'premium' || tier?.toLowerCase() === 'go';
    const isGo = tier?.toLowerCase() === 'go';

    // Format billing date from profile if available
    const getFormattedBillingDate = () => {
        if (!isPro) return 'N/A';
        const endDate = user?.user_metadata?.subscription_end_date;
        if (endDate) {
            return new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        // Fallback to a future date if not set (for demo)
        const demoDate = new Date();
        demoDate.setMonth(demoDate.getMonth() + 1);
        return demoDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Data mixing real data with some UX placeholders
    const subscription = {
        status: isPro ? 'Active' : (status === 'inactive' || status === 'cancelled' ? 'Canceled' : 'Free'),
        plan: isPro ? `AyScroll ${isGo ? 'Go' : 'Pro'}` : 'AyScroll Free',
        price: isGo ? '₹249' : (isPro ? '₹499' : '₹0'),
        period: isPro ? 'Monthly' : 'Forever',
        nextBilling: getFormattedBillingDate(),
        card: {
            brand: 'Visa',
            last4: '4242'
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight mb-1">Manage Subscription</h3>
                    <p className="text-muted-foreground text-sm font-medium">View and update your subscription preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBillingClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest"
                    >
                        <Receipt className="w-3.5 h-3.5" />
                        Billing Details
                    </button>
                    <button
                        onClick={onViewPlans}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary border border-border hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Change Plan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Status Card */}
                <div className="p-8 rounded-[32px] bg-gradient-card border border-border shadow-theme-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl ${isPro ? 'bg-brand-gradient' : 'bg-secondary'} p-[1px]`}>
                                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                                    {isPro ? <ShieldCheck className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-muted-foreground/40" />}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full ${isPro ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-muted text-muted-foreground/60 border border-border'} text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                                {isPro && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>}
                                {subscription.status}
                            </span>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h4 className="text-3xl font-black text-foreground tracking-tighter">{subscription.plan}</h4>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
                                {subscription.price} <span className="text-muted-foreground/40">/</span> {subscription.period}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-6 border-t border-border">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground/30" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{isPro ? 'Next Billing' : 'Last Billing'}</p>
                                    <p className="text-sm font-bold text-foreground/70">{subscription.nextBilling}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card - Dynamic with nFKs Pay */}
                <div className="p-8 rounded-[32px] bg-secondary/30 border border-border flex flex-col justify-between shadow-theme-md">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-bold text-foreground/80">Payment Method</h5>
                                    <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">via nFKs Pay Gateway</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {user?.user_metadata?.payment_type === 'upi' ? (
                                    <div className="w-12 h-8 rounded-lg bg-green-600 flex items-center justify-center text-[10px] font-black text-white tracking-tighter shadow-lg shadow-green-500/20">
                                        UPI
                                    </div>
                                ) : (
                                    <div className="w-12 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black text-white tracking-tighter shadow-lg shadow-blue-500/20">
                                        {user?.user_metadata?.card_brand?.toUpperCase() || 'VISA'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-foreground tracking-tight">
                                        {user?.user_metadata?.payment_type === 'upi'
                                            ? user?.user_metadata?.upi_id || 'mayank@upi'
                                            : `•••• •••• •••• ${user?.user_metadata?.card_last4 || '4242'}`}
                                    </p>
                                    <p className="text-[10px] font-medium text-muted-foreground/40">
                                        {user?.user_metadata?.payment_type === 'upi' ? 'Primary UPI ID' : `Expires ${user?.user_metadata?.card_expiry || '12/28'}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onBillingClick}
                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                            {isPro
                                ? "Updating your payment method will affect all future transactions in your current subscription."
                                : "No active subscription found. Add a payment method to upgrade anytime."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            {isPro && (
                <div className="p-6 rounded-[32px] border border-red-500/10 bg-red-500/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h5 className="text-sm font-bold text-destructive/80 mb-1">Danger Zone</h5>
                            <p className="text-[11px] font-medium text-muted-foreground/50">Canceling your subscription will immediately downgrade you to the Free plan.</p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="px-6 py-2.5 rounded-xl border border-red-500/20 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel Subscription
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSubscription;
