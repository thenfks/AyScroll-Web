import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionSection: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'Annual' | 'Monthly'>('Annual');
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Check if user has pro status from metadata
  const isPro = user?.user_metadata?.is_pro === true;

  const handleUpgrade = () => {
    setIsUpgrading(true);
    // Simulate upgrade - in production this would call a payment API
    setTimeout(() => {
      setIsUpgrading(false);
      // Show toast or update UI
    }, 800);
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
      onClick: isPro ? undefined : handleUpgrade,
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
      onClick: isPro ? undefined : handleUpgrade
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Choose Your Orbit</h3>

        {/* Billing Toggle */}
        <div className="flex bg-[#101010] p-1.5 rounded-xl border border-white/5 shadow-inner">
          {(['Annual', 'Monthly'] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 md:px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === cycle ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'text-white/30 hover:text-white/60'}`}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-6 md:p-8 rounded-[32px] flex flex-col transition-all duration-300 border hover:scale-[1.03] ${plan.highlight
                ? 'bg-[#151515] border-white/10 shadow-2xl shadow-violet-500/5'
                : 'bg-[#101010] border-white/5 hover:border-white/10'
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1.5 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-violet-600/20 border border-violet-400">
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
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.highlight ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-white/40'}`}>
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
                    ? 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/20'
                    : 'bg-white/10 hover:bg-white/20 border border-white/5'
                }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionSection;
