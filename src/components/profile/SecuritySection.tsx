import React, { useState } from 'react';
import { ShieldCheck, Key, Cpu, Smartphone, Globe, ExternalLink } from 'lucide-react';
import Toggle from './Toggle';
import { useAuth } from '@/contexts/AuthContext';

const SecuritySection: React.FC = () => {
  const { user } = useAuth();
  const [tfaEnabled, setTfaEnabled] = useState(true);

  // Determine auth provider
  const getAuthProvider = () => {
    if (!user) return 'email';

    // Check for Google
    if (user.app_metadata?.provider === 'google' || user.identities?.some(id => id.provider === 'google')) {
      return 'google';
    }

    // Check for nFKs (Custom logic based on metadata or provider)
    if (user.app_metadata?.provider === 'nfks' || user.user_metadata?.source === 'nfks') {
      return 'nfks';
    }

    // Default to email
    return 'email';
  };

  const provider = getAuthProvider();

  // Mask email for privacy
  const maskedEmail = user?.email?.replace(/(.{2})(.*)(@.*)/, '$1****$3') || 'e****n@ayscroll.com';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-black text-white tracking-tighter">Login & Security</h3>
        <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> All Systems Secure
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Info */}
        <section className="p-6 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 ${provider === 'google' ? 'bg-white' :
                provider === 'nfks' ? 'bg-black border border-white/10' :
                  'bg-indigo-500/10 text-indigo-400'
              }`}>
              {provider === 'google' ? (
                <img src="/google_logo.svg" alt="Google" className="w-full h-full object-contain" />
              ) : provider === 'nfks' ? (
                <img src="/nfks-identity-logo.png" alt="nFKs" className="w-full h-full object-contain" />
              ) : (
                <Key className="w-6 h-6" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-white leading-tight">Authentication</h4>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">
                {provider === 'google' ? 'Google Account' :
                  provider === 'nfks' ? 'nFKs ID' :
                    'Email & Password'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-1 px-2">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Email Address</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white/70">{maskedEmail}</span>
                {provider === 'email' && (
                  <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-pink-400 transition-colors">Change</button>
                )}
              </div>
            </div>

            <div className="h-px bg-white/5"></div>

            {provider === 'email' ? (
              <div className="flex flex-col gap-1 px-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Password</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">••••••••••••••</span>
                  <button className="text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-pink-400 transition-colors">Update</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-2">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Password Manager</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/50">Managed by {provider === 'google' ? 'Google' : 'nFKs'}</span>
                  <a
                    href={provider === 'google' ? 'https://myaccount.google.com/' : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
                  >
                    <span>Manage</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2FA Section */}
        <section className="p-6 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white leading-tight">Two-Factor Auth</h4>
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Enhanced Security</p>
            </div>
          </div>

          <p className="text-[12px] text-white/30 font-medium leading-relaxed mb-6 px-2">
            Add an extra layer of security to your account by requiring more than just a password to log in.
          </p>

          <div className="flex items-center justify-between bg-white/[0.03] p-6 rounded-[28px] border border-white/5">
            <span className="text-sm font-bold text-white/80">Protection Active</span>
            <Toggle enabled={tfaEnabled} onChange={() => setTfaEnabled(!tfaEnabled)} />
          </div>
        </section>
      </div>

      {/* Login History / Devices */}
      <section className="p-6 rounded-[40px] bg-white/[0.02] border border-white/5 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white tracking-tight">Active Devices</h3>
          <button className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-pink-500 transition-colors">Revoke All Other Sessions</button>
        </div>

        <div className="space-y-6">
          {[
            { device: 'MacBook Pro 16"', location: 'San Francisco, US', time: 'Active Now', icon: Cpu, current: true },
            { device: 'iPhone 15 Pro', location: 'London, UK', time: '2h ago', icon: Smartphone },
            { device: 'iPad Air', location: 'Tokyo, JP', time: 'Jan 24, 2024', icon: Smartphone },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center ${session.current ? 'text-pink-500 border-pink-500/20' : 'text-white/20'}`}>
                  {(() => {
                    const Icon = session.icon;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h5 className="text-[15px] font-bold text-white/90">{session.device}</h5>
                  <div className="flex items-center gap-2 text-[11px] text-white/20 font-medium">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{session.location}</span>
                    <span>•</span>
                    <span className={session.current ? 'text-emerald-400 font-black' : ''}>{session.time}</span>
                  </div>
                </div>
              </div>
              {!session.current && (
                <button className="px-5 py-2 rounded-xl bg-white/5 text-[10px] font-black text-white/20 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SecuritySection;
