import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center">
          <p>You must be logged in to view this page.</p>
        </div>
      </MainLayout>
    );
  }

  const { name, username, avatar_url } = user.user_metadata;

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar_url} alt={name} />
                <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{name}</CardTitle>
                <p className="text-muted-foreground">@{username}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6">
              <h3 className="text-lg font-semibold">About</h3>
              <p className="mt-2 text-muted-foreground">
                This is a placeholder for the user's bio.
              </p>
            </div>
            <div className="mt-6">
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
