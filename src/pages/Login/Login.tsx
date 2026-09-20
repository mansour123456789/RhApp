import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isGlobalLoading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (err) {
      if (err instanceof z.ZodError) { setError(err.errors[0].message); return; }
    }

    setLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      // For now, redirect to a dummy dashboard or HR home
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="mx-auto min-h-screen w-full max-w-7xl p-4 md:p-10 flex items-center">
        <div className="w-full overflow-hidden rounded-2xl border bg-card shadow-xl">
          <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-2">
            {/* Left image panel */}
            <div className="relative hidden lg:block">
              <img
                src="/login.png.png"
                alt="EcoPilot HR login"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Right form panel */}
            <div className="flex flex-col justify-center bg-card p-8 md:p-14">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 grid grid-cols-[20px_1fr] grid-rows-[auto_auto] items-center gap-x-3 gap-y-1 text-left">
                  <div className="text-[28px] font-semibold leading-none tracking-tight text-[#1B4591] col-span-2">
                    Espace RH
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground mt-2">
                    Connectez-vous à votre portail RH{' '}
                    <span className="font-semibold text-muted-foreground">ECOPILOT</span>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Entrer votre email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isGlobalLoading}
                      autoComplete="email"
                      className="h-11 rounded-xl border-transparent bg-[#ECF4FF] focus-visible:ring-[#93C5FD]"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Entrer votre mot de passe"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={isGlobalLoading}
                        autoComplete="current-password"
                        className="h-11 rounded-xl border-transparent bg-[#ECF4FF] pr-10 focus-visible:ring-[#93C5FD]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-11 w-full rounded-full !bg-[#1B4591] font-medium text-white shadow-sm hover:!bg-[#163A79]"
                    disabled={isGlobalLoading}
                  >
                    {isGlobalLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
