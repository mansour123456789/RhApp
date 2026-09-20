import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

export const HomePage: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="text-2xl font-bold tracking-tight">
          Enterprise Boilerplate
        </div>
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground">
            Scalable Frontend <br />
            Architectures
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A production-ready React boilerplate built with Vite, TypeScript, Zustand, and TanStack Query.
            Enforced modularity for enterprise-level projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold rounded-none">
                Go to Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-none">
              View Components
            </Button>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 rounded-none border bg-muted/50">
            <div className="w-12 h-12 bg-primary/10 rounded-none flex items-center justify-center mb-4">
              <span className="text-2xl">🏗️</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Feature-Based</h3>
            <p className="text-muted-foreground">Strictly isolated features for massive scale.</p>
          </div>
          <div className="p-6 rounded-none border bg-muted/50">
            <div className="w-12 h-12 bg-primary/10 rounded-none flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Vite Optimized</h3>
            <p className="text-muted-foreground">Ultra-fast development and build times.</p>
          </div>
          <div className="p-6 rounded-none border bg-muted/50">
            <div className="w-12 h-12 bg-primary/10 rounded-none flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Type Safe</h3>
            <p className="text-muted-foreground">Strict TypeScript mode and path aliases.</p>
          </div>
        </div>
      </main>
      
      <footer className="py-12 border-t text-center text-slate-500 text-sm">
        © 2026 Enterprise Frontend Architectures. Built with excellence.
      </footer>
    </div>
  );
};
