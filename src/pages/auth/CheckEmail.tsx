import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CheckEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl">Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We've sent a confirmation link to your email address. Please click the link to activate your account.
          </p>
          <div className="mt-6">
            <Link to="/signin" className="text-sm underline">
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckEmail;
