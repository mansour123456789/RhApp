import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const login = useEmployeeStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    
    const success = login(email);
    if (success) {
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } else {
      toast.error('Email non reconnu. Utilisez admin@gmail.com, maha@gmail.com ou mansour@gmail.com');
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white dark:bg-slate-900">
      {/* Colonne Formulaire (Gauche) */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 max-w-3xl xl:max-w-4xl mx-auto lg:mx-0 w-full lg:w-1/2 relative z-10">
        
        {/* Logo */}
        <div className="absolute top-10 left-8 sm:left-12 md:left-24 lg:left-32 flex items-center gap-2">
          <div className="bg-[#1B4591] p-2 rounded-lg">
            <img 
              src="/buildings.png" 
              alt="EcoPilot Logo" 
              className="w-6 h-6 filter brightness-0 invert" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1B4591] dark:text-blue-400">EcoPilot RH</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10 text-center lg:text-left mt-16 lg:mt-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">Bienvenue</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Connectez-vous à votre espace collaborateur.
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email professionnel</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nom@entreprise.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-12 px-4 rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mot de passe</Label>
                <a href="#" className="text-sm text-[#1B4591] hover:underline font-medium">Mot de passe oublié ?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                defaultValue="password123" 
                className="h-12 px-4 rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800"
              />
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl bg-[#1B4591] hover:bg-[#163A79] text-white shadow-md hover:shadow-lg transition-all">
              Se connecter
            </Button>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50/50 dark:bg-blue-900/20 p-5 rounded-xl mt-8 border border-blue-100 dark:border-blue-900">
              <p className="font-semibold text-[#1B4591] dark:text-blue-400 mb-2">Comptes de test disponibles :</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono shadow-sm">admin@gmail.com</code> <span className="text-xs text-gray-500">(Admin RH)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono shadow-sm">maha@gmail.com</code> <span className="text-xs text-gray-500">(Manager)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <code className="bg-white dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono shadow-sm">mansour@gmail.com</code> <span className="text-xs text-gray-500">(Employé)</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>

      {/* Colonne Image (Droite - Cachée sur mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#1B4591] relative overflow-hidden">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4591]/90 to-[#0A2558]/95 mix-blend-multiply z-10"></div>
        
        {/* Image de fond moderne bureau/collaboration */}
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
          alt="Équipe au travail" 
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Contenu sur l'image */}
        <div className="relative z-20 flex flex-col justify-end p-16 text-white w-full">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Gérez vos talents de demain, dès aujourd'hui.
            </h2>
            <p className="text-lg text-blue-100 font-light leading-relaxed">
              La plateforme SIRH nouvelle génération qui connecte les équipes, fluidifie la gestion et valorise chaque collaborateur.
            </p>
            
            <div className="mt-8 flex gap-3 items-center">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-[#1B4591]" src="https://i.pravatar.cc/100?img=33" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1B4591]" src="https://i.pravatar.cc/100?img=47" alt="" />
                <img className="w-10 h-10 rounded-full border-2 border-[#1B4591]" src="https://i.pravatar.cc/100?img=12" alt="" />
              </div>
              <p className="text-sm font-medium text-blue-200">Rejoignez plus de 10 000 collaborateurs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
