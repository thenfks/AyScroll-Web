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

        // Add user to Brevo contact list after email confirmation
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          // Add to Brevo if:
          // 1. Email is confirmed (regular signup), OR
          // 2. User signed in with OAuth (Google, etc.) - these are auto-confirmed
          const isEmailConfirmed = user.email_confirmed_at !== null;
          const isOAuthUser = user.app_metadata?.provider !== 'email';

          if (isEmailConfirmed || isOAuthUser) {
            try {
              // Add user to Brevo contact list
              await fetch(
                "https://wbsepuoccppuqirtowzg.supabase.co/functions/v1/brevo-add-contact",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k--ni6qtOBjAjUrTDigxUA_nEMp3eeA'}`,
                  },
                  body: JSON.stringify({
                    email: user.email,
                    firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
                    lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || '',
                  }),
                }
              );
              console.log('✅ User added to Brevo contact list');

              // Send welcome email
              await fetch(
                "https://wbsepuoccppuqirtowzg.supabase.co/functions/v1/send-welcome-email",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_k--ni6qtOBjAjUrTDigxUA_nEMp3eeA'}`,
                  },
                  body: JSON.stringify({
                    email: user.email,
                    firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || '',
                    lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ')[1] || '',
                  }),
                }
              );
              console.log('✅ Welcome email sent successfully');
            } catch (error) {
              console.error('❌ Failed to add user to Brevo:', error);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
