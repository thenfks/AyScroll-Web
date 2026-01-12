import React from 'react';
import { Diamond, ArrowRight, Receipt, Upload } from 'lucide-react';

interface SubscriptionCardProps {
    onManageClick: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ onManageClick }) => {
    return (
        <section className="p-6 rounded-[40px] bg-[#1A1A1A] border border-white/5 shadow-xl relative overflow-hidden group">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/15 transition-all duration-500"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white">Subscription</h3>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 border border-green-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Active
                </span>
            </div>

            <div className="relative z-10 p-5 rounded-3xl bg-white/[0.03] border border-white/5 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <Diamond className="w-5 h-5 text-white fill-white/20" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white">AyScroll Pro</h4>
                        <p className="text-white/40 text-xs font-medium">$19.00 / month</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-white/40">
                        <span>Renews in 21 days</span>
                        <span className="text-white/60">Oct 24, 2024</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-3">
                <button
                    onClick={onManageClick}
                    className="w-full py-3.5 bg-white text-black rounded-2xl font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                >
                    Manage Subscription
                    <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2 group/btn">
                        <Receipt className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                        <span className="text-xs font-bold text-white/60 group-hover/btn:text-white transition-colors">Billing Info</span>
                    </button>
                    <button className="py-3 px-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-2 group/btn">
                        <Upload className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                        <span className="text-xs font-bold text-white/60 group-hover/btn:text-white transition-colors">Upgrade</span>
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
