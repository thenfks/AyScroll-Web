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
        <h3 className="text-2xl font-black text-foreground tracking-tighter">Login & Security</h3>
        <span className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-grow-500"></div> All Systems Secure
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Info */}
        <section className="p-6 rounded-[40px] bg-secondary/30 border border-border shadow-theme-md">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center p-2.5 ${provider === 'google' ? 'bg-foreground' :
              provider === 'nfks' ? 'bg-sidebar border border-border' :
                'bg-primary/10 text-primary'
              }`}>
              {provider === 'google' ? (
                <img src="/google_logo.svg" alt="Google" className="w-full h-full object-contain filter invert dark:invert-0" />
              ) : provider === 'nfks' ? (
                <img src="/nfks-identity-logo.png" alt="nFKs" className="w-full h-full object-contain" />
              ) : (
                <Key className="w-6 h-6" />
              )}
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground leading-tight">Authentication</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                {provider === 'google' ? 'Google Account' :
                  provider === 'nfks' ? 'nFKs ID' :
                    'Email & Password'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-1 px-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/80">{maskedEmail}</span>
                {provider === 'email' && (
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-80 transition-colors">Change</button>
                )}
              </div>
            </div>

            <div className="h-px bg-border"></div>

            {provider === 'email' ? (
              <div className="flex flex-col gap-1 px-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Password</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/70">••••••••••••••</span>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-80 transition-colors">Update</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 px-2">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Password Manager</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Managed by {provider === 'google' ? 'Google' : 'nFKs'}</span>
                  <a
                    href={provider === 'google' ? 'https://myaccount.google.com/' : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
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
        <section className="p-6 rounded-[40px] bg-secondary/30 border border-border shadow-theme-md flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground leading-tight">Two-Factor Auth</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Enhanced Security</p>
            </div>
          </div>

          <p className="text-[12px] text-muted-foreground font-medium leading-relaxed mb-6 px-2">
            Add an extra layer of security to your account by requiring more than just a password to log in.
          </p>

          <div className="flex items-center justify-between bg-secondary/50 p-6 rounded-[28px] border border-border">
            <span className="text-sm font-bold text-foreground/80">Protection Active</span>
            <Toggle enabled={tfaEnabled} onChange={() => setTfaEnabled(!tfaEnabled)} />
          </div>
        </section>
      </div>

      {/* Login History / Devices */}
      <section className="p-6 rounded-[40px] bg-secondary/30 border border-border shadow-theme-md">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-foreground tracking-tight">Active Devices</h3>
          {/* <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Revoke All Other Sessions</button> */}
        </div>

        <div className="space-y-6">
          <ActiveSessions />
        </div>
      </section>
    </div>
  );
};

// Helper component for Active Sessions
import { supabase } from '@/integrations/supabase/client';

const ActiveSessions: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      // 1. Identify "Current" Session locally (this ID is managed/created by AuthContext)
      const localSessionId = sessionStorage.getItem('ayscroll_session_id');
      setCurrentSessionId(localSessionId);

      // 2. Fetch All Sessions from DB
      const { data: allSessions } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_active', { ascending: false });

      if (allSessions) {
        setSessions(allSessions);
      }
    };

    fetchSessions(); // Fetch initially

    // 3. Real-time updates (optional, keeps list fresh)
    const channel = supabase
      .channel('public:user_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_sessions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          fetchSessions(); // Re-fetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (sessions.length === 0) {
    return <div className="text-muted-foreground text-sm">Loading sessions...</div>;
  }

  return (
    <>
      {sessions.map((session) => {
        const isCurrent = session.id === currentSessionId;
        const isMobile = /Mobile|Tablet|Android|iOS|iPhone/i.test(session.device_type) || session.os === 'iOS' || session.os === 'Android';

        return (
          <div key={session.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center ${isCurrent ? 'text-primary' : 'text-muted-foreground/20'}`}>
                {isMobile ? <Smartphone className="w-6 h-6" /> : <Cpu className="w-6 h-6" />}
              </div>
              <div>
                <h5 className="text-[15px] font-bold text-foreground/90">{session.browser} on {session.os}</h5>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground/50 font-medium">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{session.location}</span>
                  <span>•</span>
                  {isCurrent ? (
                    <span className="text-green-500 font-black">Active Now</span>
                  ) : (
                    <span>Last active: {new Date(session.last_active).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
            {!isCurrent && (
              <button
                onClick={async () => {
                  await supabase.from('user_sessions').delete().eq('id', session.id);
                  setSessions(sessions.filter(s => s.id !== session.id));
                }}
                className="px-5 py-2 rounded-xl bg-secondary text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:bg-destructive/20 hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
              >
                Revoke
              </button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default SecuritySection;
