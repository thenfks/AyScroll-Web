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
    const isPro = tier?.toLowerCase() === 'pro' || tier?.toLowerCase() === 'premium' || tier?.toLowerCase() === 'go';
    const isGo = tier?.toLowerCase() === 'go';

    // Real data mixed with some mock for UX
    const subscription = {
        status: isPro ? 'Active' : (status === 'inactive' ? 'Canceled' : 'Free'),
        plan: isPro ? `AyScroll ${isGo ? 'Go' : 'Pro'}` : 'AyScroll Free',
        price: isGo ? '₹249' : (isPro ? '₹499' : '₹0'),
        period: isPro ? 'Monthly' : 'Forever',
        nextBilling: isPro ? 'Feb 13, 2026' : 'N/A',
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
                    <h3 className="text-2xl font-black text-white tracking-tight mb-1">Manage Subscription</h3>
                    <p className="text-white/40 text-sm font-medium">View and update your subscription preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBillingClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest"
                    >
                        <Receipt className="w-3.5 h-3.5" />
                        Billing Details
                    </button>
                    <button
                        onClick={onViewPlans}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Change Plan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Main Status Card */}
                <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-500/10 transition-colors duration-500"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl ${isPro ? 'bg-gradient-to-br from-pink-500 to-orange-500' : 'bg-white/5'} p-[1px]`}>
                                <div className="w-full h-full rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    {isPro ? <ShieldCheck className="w-6 h-6 text-white" /> : <Shield className="w-6 h-6 text-white/20" />}
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full ${isPro ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/30 border border-white/10'} text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                                {isPro && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>}
                                {subscription.status}
                            </span>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h4 className="text-3xl font-black text-white tracking-tighter">{subscription.plan}</h4>
                            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
                                {subscription.price} <span className="text-white/20">/</span> {subscription.period}
                            </p>
                        </div>

                        <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-white/20" />
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{isPro ? 'Next Billing' : 'Last Billing'}</p>
                                    <p className="text-sm font-bold text-white/60">{subscription.nextBilling}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Card */}
                <div className="p-8 rounded-[32px] bg-[#101010] border border-white/5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-white/40" />
                                </div>
                                <h5 className="text-sm font-bold text-white/80">Payment Method</h5>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white tracking-tighter">
                                    {subscription.card.brand.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white tracking-tight">•••• •••• •••• {subscription.card.last4}</p>
                                    <p className="text-[10px] font-medium text-white/20">Expires 12/28</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors">Edit</button>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-orange-500/60 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium text-white/40 leading-relaxed">
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
                            <h5 className="text-sm font-bold text-red-500/80 mb-1">Danger Zone</h5>
                            <p className="text-[11px] font-medium text-white/20">Canceling your subscription will immediately downgrade you to the Free plan.</p>
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
