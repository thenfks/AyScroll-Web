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
        <div className="flex bg-white/[0.03] p-1.5 rounded-xl md:rounded-2xl border border-white/10 shadow-inner">
          {(['Annual', 'Monthly'] as const).map((cycle) => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 md:px-8 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${billingCycle === cycle ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}
            >
              {cycle}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative p-5 md:p-6 rounded-2xl md:rounded-[40px] flex flex-col transition-all duration-500 border overflow-hidden ${plan.highlight ? 'bg-gradient-to-b from-pink-500/10 to-transparent border-pink-500/30 shadow-2xl scale-[1.02]' : 'bg-white/[0.02] border-white/5 shadow-xl'}`}
          >
            {plan.badge && (
              <div className="absolute top-4 md:top-6 right-4 md:right-6">
                <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${plan.badge === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : plan.highlight ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${plan.badge === 'Active' ? 'bg-emerald-400' : plan.highlight ? 'bg-pink-400' : 'bg-orange-400'}`}></div> {plan.badge}
                </span>
              </div>
            )}

            <div className="text-center mb-6 md:mb-8 pt-4">
              <h4 className={`text-xl md:text-2xl font-black mb-4 md:mb-6 ${plan.highlight ? 'text-pink-500' : 'text-white'}`}>{plan.name}</h4>
              <p className="text-white/30 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-6 md:mb-8">{plan.description}</p>
              
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl md:text-2xl font-black text-white self-start mt-1">₹</span>
                <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                <div className="flex flex-col items-start ml-2">
                  {plan.originalPrice && <span className="text-base md:text-lg text-white/20 line-through font-bold">₹{plan.originalPrice}</span>}
                  <span className="text-[11px] md:text-[12px] text-white/30 font-bold uppercase tracking-widest">{plan.period}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1 mb-6 md:mb-8 px-1 md:px-2">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 md:gap-4 group">
                  <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-pink-500/20 text-pink-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <Check className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-[12px] md:text-[13px] font-medium text-white/60 group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={plan.onClick}
              disabled={plan.disabled && plan.name !== 'Go'}
              className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-white uppercase tracking-widest text-[10px] md:text-[11px] shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] ${plan.disabled && plan.name !== 'Go' ? 'bg-white/5 text-white/20 cursor-default shadow-none border border-white/5 scale-100' : plan.highlight || plan.name === 'Free' ? 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/20' : 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.08]'}`}
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
