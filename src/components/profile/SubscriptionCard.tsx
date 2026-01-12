import React, { useEffect, useState } from 'react';
import { Diamond, ArrowRight, Receipt, Upload, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionCardProps {
    onManageClick: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ onManageClick }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<{
        tier: string;
        status: string;
        endDate: string | null;
    } | null>(null);

    useEffect(() => {
        if (user) {
            loadSubscription();
        }
    }, [user]);

    const loadSubscription = async () => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('subscription_tier, subscription_status, subscription_end_date')
                .eq('id', user?.id)
                .single();

            if (error) throw error;

            if (data) {
                setSubscription({
                    tier: data.subscription_tier || 'free',
                    status: data.subscription_status || 'inactive',
                    endDate: data.subscription_end_date,
                });
            }
        } catch (error) {
            console.error('Error loading subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="p-6 rounded-[40px] bg-[#1A1A1A] border border-white/5 shadow-xl min-h-[200px] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
            </section>
        );
    }

    const isPro = subscription?.tier?.toLowerCase() === 'pro' || subscription?.tier?.toLowerCase() === 'premium';
    const displayTier = isPro ? 'AyScroll Pro' : 'AyScroll Free';
    const displayPrice = isPro ? '$19.00 / month' : '$0.00 / month';

    // Calculate days remaining if endDate exists
    let daysRemaining = 0;
    let formattedEndDate = null;

    if (subscription?.endDate) {
        const end = new Date(subscription.endDate);
        const now = new Date();
        const diffTime = Math.abs(end.getTime() - now.getTime());
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        formattedEndDate = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // Progress bar width (mocked for now or calculated based on start/end if available)
    const progressWidth = isPro ? '70%' : '100%';

    return (
        <section className="p-6 rounded-[40px] bg-[#1A1A1A] border border-white/5 shadow-xl relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-500 ${isPro ? 'bg-purple-500/10 group-hover:bg-purple-500/15' : 'bg-gray-500/5 group-hover:bg-gray-500/10'}`}></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white">Subscription</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 border ${subscription?.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${subscription?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    {subscription?.status || 'Unknown'}
                </span>
            </div>

            <div className="relative z-10 p-5 rounded-3xl bg-white/[0.03] border border-white/5 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl p-[1px] ${isPro ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-white/10'}`}>
                        <div className="w-full h-full rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Diamond className={`w-5 h-5 ${isPro ? 'text-white fill-white/20' : 'text-white/40'}`} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white">{displayTier}</h4>
                        <p className="text-white/40 text-xs font-medium">{displayPrice}</p>
                    </div>
                </div>

                {isPro && subscription?.endDate ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-medium text-white/40">
                            <span>Renews in {daysRemaining} days</span>
                            <span className="text-white/60">{formattedEndDate}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" style={{ width: progressWidth }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-[11px] font-medium text-white/40">Upgrade to Pro to unlock all features.</p>
                    </div>
                )}
            </div>

            <div className="relative z-10 space-y-3">
                {isPro ? (
                    <button
                        onClick={onManageClick}
                        className="w-full py-3.5 bg-white text-black rounded-2xl font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                    >
                        Manage Subscription
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={onManageClick}
                        className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                    >
                        Upgrade to Pro
                        <Upload className="w-4 h-4" />
                    </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2 group/btn">
                        <Receipt className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                        <span className="text-xs font-bold text-white/60 group-hover/btn:text-white transition-colors">Billing Info</span>
                    </button>
                    <button className="py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2 group/btn">
                        {isPro ? (
                            <>
                                <Upload className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                                <span className="text-xs font-bold text-white/60 group-hover/btn:text-white transition-colors">Upgrade Plan</span>
                            </>
                        ) : (
                            <>
                                <Diamond className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                                <span className="text-xs font-bold text-white/60 group-hover/btn:text-white transition-colors">Compare Plans</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 text-white/20">🔒</span>
                <span className="text-[10px] font-medium text-white/20">Secure payment via Stripe</span>
            </div>
        </section>
    );
};

export default SubscriptionCard;
