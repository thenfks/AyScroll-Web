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
  signInWithGitHub: () => Promise<void>;
  signInWithGitLab: () => Promise<void>;
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

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signInWithGitLab = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'gitlab',
      options: {
        redirectTo: window.location.origin,
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
    signInWithGitHub,
    signInWithGitLab,
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
