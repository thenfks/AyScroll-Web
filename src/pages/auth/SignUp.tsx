import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (!cleanUsername) {
        setUsernameError("");
        return;
      }

      if (cleanUsername.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        return;
      }

      setCheckingUsername(true);
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('username', cleanUsername)
          .single();

        if (data) {
          setUsernameError("Username is already taken");
        } else {
          setUsernameError("");
        }
      } catch (error) {
        setUsernameError("");
      } finally {
        setCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameError) return;

    setError('');
    setLoading(true);
    try {
      const { error } = await signUp({
        email,
        password,
        options: {
          data: {
            name,
            username: username.toLowerCase().replace(/[^a-z0-9_]/g, '')
          }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        toast.success('Please check your email to confirm your account.');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay for UX
        navigate('/check-email');
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignUp}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Mayank Jha" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="mayankjha"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className={usernameError ? "border-red-500 pr-10" : "pr-10"}
                    required
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
                {!usernameError && !checkingUsername && <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and underscores only</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !!usernameError || checkingUsername}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={signInWithGoogle}>
              <img src="/google_logo.svg" alt="Google" className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" asChild>
              <a href="https://auth.nfks.co.in/?app=AyScroll">
                <img src="/nfks-identity-logo.png" alt="nFKs Identity Logo" className="mr-2 h-4 w-4" />
                nFKs ID
              </a>
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
