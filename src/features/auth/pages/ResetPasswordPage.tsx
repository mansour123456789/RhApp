import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { ChevronLeft } from 'lucide-react';

export const ResetPasswordPage: FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Reset request:', data);
    // In a real app, send reset link then navigate to success state or login
    alert('Reset link sent if account exists.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 border-primary/10 shadow-2xl">
        <CardHeader className="space-y-1">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
            <ChevronLeft className="w-4 h-4" /> Back to login
          </Link>
          <CardTitle className="text-3xl font-bold tracking-tighter">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                {...register('email')} 
                type="email" 
                placeholder="m@example.com" 
                required 
                className="bg-muted border-none"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full text-lg h-12">
              Send Reset Link
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
