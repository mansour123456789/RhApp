import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/shared/lib/utils';
import { useEmployeeStore } from '@/shared/store/mock-data';
import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/shared/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('rh-sidebar-collapsed');
    return saved === 'true';
  });

  const user = useEmployeeStore((state) => state.currentUser);
  const logoutAction = useEmployeeStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  useEffect(() => {
    localStorage.setItem('rh-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div 
        className={cn(
          "transition-all duration-300 flex flex-col min-h-screen",
          collapsed ? "lg:pl-[88px]" : "lg:pl-[248px]"
        )}
      >
        {/* Header simple avec profil utilisateur */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#F1F4F9] dark:border-sidebar-border bg-white dark:bg-sidebar px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors outline-none">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Nouveau document</span>
                      <span className="text-xs text-muted-foreground">Il y a 1h</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Votre fiche de paie de Juillet est disponible.</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-sm">Congé approuvé</span>
                      <span className="text-xs text-muted-foreground">Il y a 3h</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Votre demande de congé a été acceptée.</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="w-px h-6 bg-border mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <div className="text-sm font-semibold leading-none text-[#263248] dark:text-white">
                    {user ? `${user.firstName} ${user.lastName}` : 'Administrateur RH'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {user?.email || 'admin@ecopilot.ma'}
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.firstName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-[#1B4591] flex items-center justify-center text-white font-medium">
                      {user?.firstName?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-2"
                  title="Déconnexion"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Bouton pour plier/déplier la sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="fixed bottom-6 z-50 rounded-full border border-border bg-white dark:bg-sidebar p-2 shadow-md hidden lg:flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          style={{ left: collapsed ? '72px' : '232px' }}
        >
          <img 
            src="/Toggle.png" 
            alt="Toggle" 
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed ? "rotate-180" : ""
            )} 
          />
        </button>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
