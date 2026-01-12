import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<{ error: Error | null }>;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Send welcome email only when a new user signs up (not on every login)
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          // Check if we've already sent the welcome email for this user
          const welcomeEmailSentKey = `welcome_email_sent_${user.id}`;
          const alreadySent = localStorage.getItem(welcomeEmailSentKey);

          if (alreadySent) {
            console.log('ℹ️ Welcome email already sent to this user');
            return;
          }

          // Check if this is a new user (created within the last 5 minutes)
          const userCreatedAt = new Date(user.created_at);
          const now = new Date();
          const timeDiffMinutes = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60);
          const isNewUser = timeDiffMinutes < 5;

          if (!isNewUser) {
            console.log('ℹ️ Existing user login - skipping welcome email');
            // Mark as sent for existing users to avoid checking again
            localStorage.setItem(welcomeEmailSentKey, 'true');
            return;
          }

          // Add to Brevo if:
          // 1. Email is confirmed (regular signup), OR
          // 2. User signed in with OAuth (Google, etc.) - these are auto-confirmed
          const isEmailConfirmed = user.email_confirmed_at !== null;
          const isOAuthUser = user.app_metadata?.provider !== 'email';

          if (isEmailConfirmed || isOAuthUser) {
            try {
              // Get the session token for authenticated requests
              const sessionToken = session?.access_token;

              if (!sessionToken) {
                console.warn('⚠️ No session token available');
                return;
              }

              // Add user to Brevo contact list
              const brevoResponse = await fetch(
                "https://wbsepuoccppuqirtowzg.supabase.co/functions/v1/brevo-add-contact",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`,
                  },
                  body: JSON.stringify({
                    email: user.email,
                    firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
                    lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || '',
                  }),
                }
              );

              if (brevoResponse.ok) {
                console.log('✅ User added to Brevo contact list');
              } else {
                const errorData = await brevoResponse.json();
                console.error('❌ Failed to add user to Brevo:', errorData);
              }

              // Send welcome email (only on first signup)
              const emailResponse = await fetch(
                "https://wbsepuoccppuqirtowzg.supabase.co/functions/v1/send-welcome-email",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionToken}`,
                  },
                  body: JSON.stringify({
                    email: user.email,
                    firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
                    lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || '',
                  }),
                }
              );

              if (emailResponse.ok) {
                console.log('✅ Welcome email sent successfully (first time user)');
                // Mark that we've sent the welcome email for this user
                localStorage.setItem(welcomeEmailSentKey, 'true');
              } else {
                const errorData = await emailResponse.json();
                console.error('❌ Failed to send welcome email:', errorData);
              }
            } catch (error) {
              console.error('❌ Error in Brevo integration:', error);
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (credentials: SignInWithPasswordCredentials) => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error };
  };

  const signUp = async (credentials: SignUpWithPasswordCredentials) => {
    const { error } = await supabase.auth.signUp({
      ...credentials,
      options: {
        ...credentials.options,
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signOut = async () => {
    // Cleanup active session trace in DB
    const localSessionId = sessionStorage.getItem('ayscroll_session_id');
    if (localSessionId) {
      await supabase.from('user_sessions').delete().eq('id', localSessionId);
      sessionStorage.removeItem('ayscroll_session_id');
    }
    await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://ayscroll.com',
      },
    });
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const signInWithUsername = async (username: string, password: string) => {
    const { data: email, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: username });

    if (rpcError) {
      return { error: rpcError };
    }

    if (!email) {
      return { error: new Error('User not found') };
    }

    return signIn({ email, password });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    signInWithUsername,
    isGuest: !user,
  };

  // Session Tracking & Revocation Logic
  useEffect(() => {
    if (!user) return;

    // 1. Initial Session Registration
    const registerSession = async () => {
      try {
        const ua = navigator.userAgent;
        let location = 'Unknown Location';
        let ip = '';

        try {
          // Simple timeout to prevent blocking auth flow excessively
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            location = `${data.city}, ${data.country_code}`;
            ip = data.ip;
          }
          clearTimeout(timeoutId);
        } catch (e) {
          console.warn('Location fetch skipped/failed', e);
        }

        // Detect details
        let browser = 'Unknown Browser';
        if (ua.indexOf("Edg") !== -1) browser = "Edge";
        else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
        else if (ua.indexOf("Safari") !== -1) browser = "Safari";

        let os = 'Unknown OS';
        const platform = navigator.platform;
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        if (/iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
          os = /iPad/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1) ? 'iPadOS' : 'iOS';
        } else if (/Mac/.test(ua)) os = "macOS";
        else if (/Win/.test(ua)) os = "Windows";
        else if (/Android/.test(ua)) os = "Android";
        else if (/Linux/.test(ua)) os = "Linux";

        const localSessionId = sessionStorage.getItem('ayscroll_session_id');
        const deviceInfo = {
          user_id: user.id,
          user_agent: ua,
          ip_address: ip,
          location: location,
          device_type: /mobile/i.test(ua) ? 'Mobile' : /pad/i.test(ua) ? 'Tablet' : 'Desktop',
          os: os,
          browser: browser,
          last_active: new Date().toISOString()
        };

        if (localSessionId) {
          // Update existing
          const { error } = await supabase
            .from('user_sessions')
            .update(deviceInfo)
            .eq('id', localSessionId);

          // If error (e.g. record deleted), we treat as invalid and let the loop handle it or creating new?
          // For now, if update fails (row missing), we assume it's revoked or new session needed.
          // But effectively, if localSessionId exists but row missing => revoked.
        } else {
          // Create new
          const { data, error } = await supabase
            .from('user_sessions')
            .insert(deviceInfo)
            .select()
            .single();

          if (data) {
            sessionStorage.setItem('ayscroll_session_id', data.id);
          }
        }
      } catch (err) {
        console.error('Session registration failed', err);
      }
    };

    registerSession();

    // 2. Periodic Revocation Check (Poll every 10s)
    const intervalId = setInterval(async () => {
      const localSessionId = sessionStorage.getItem('ayscroll_session_id');
      if (!localSessionId) return; // Should we create one? Maybe. 

      const { data, error } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('id', localSessionId)
        .maybeSingle();

      // If no data found, it means the session was deleted/revoked
      if (!data && !error) {
        console.log('Session revoked remotely. Signing out...');
        sessionStorage.removeItem('ayscroll_session_id');
        await supabase.auth.signOut();
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
