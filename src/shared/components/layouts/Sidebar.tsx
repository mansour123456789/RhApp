import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEmployeeStore } from '@/shared/store/mock-data';
import {
  sidebarAsideClass,
  sidebarLogoLinkClass,
  sidebarNavClass,
  sidebarNavFooterClass,
  sidebarNavLabelClass,
  sidebarNavLinkClass,
  sidebarNavMainClass,
  sidebarSectionTitleClass,
  sidebarSectionWrapClass,
} from './sidebarNavStyles';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Tableau de bord',
    icon: '/home-2.png',
    path: '/dashboard',
  },
  {
    key: 'my-profile',
    label: 'Mon Profil',
    icon: '/userr.png',
    path: '/my-profile',
  },
  {
    key: 'employees',
    label: 'Employés',
    icon: '/profile-2user.png',
    path: '/employees',
    matchPaths: ['/employees'],
  },
  {
    key: 'onboarding',
    label: 'Recrutement',
    icon: '/user-search.png',
    path: '/onboarding',
  },
  {
    key: 'pointage',
    label: 'Pointage',
    icon: '/clock.png',
    path: '/pointage',
  },
  {
    key: 'conges',
    label: 'Congés & Absences',
    icon: '/timer-pause.png',
    path: '/conges',
  },
  {
    key: 'planning',
    label: 'Planning',
    icon: '/clipboard-text.png',
    path: '/planning',
  },
  {
    key: 'paie',
    label: 'Paie',
    icon: '/book-saved.png',
    path: '/paie',
  },
  {
    key: 'expenses',
    label: 'Notes de Frais',
    icon: '/receive-square.png',
    path: '/expenses',
  },
  {
    key: 'performance',
    label: 'Performance',
    icon: '/medal-star.png',
    path: '/performance',
  },

  {
    key: 'documents',
    label: 'Documents & GED',
    icon: '/folder-open.png',
    path: '/documents',
  },

  {
    key: 'calendar',
    label: 'Calendrier Global',
    icon: '/timer.png',
    path: '/calendar',
  },
  {
    key: 'statistiques',
    label: 'Statistiques',
    icon: '/cible.png',
    path: '/statistiques',
  },
  {
    key: 'settings',
    label: 'Paramètres',
    icon: '/setting-4.png',
    path: '/settings',
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

function NavIcon({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  // Use Tailwind classes to handle dark mode robustly instead of inline styles and useTheme
  // active: always white (brightness-0 invert)
  // inactive: black in light mode (brightness-0 opacity-70), white in dark mode (dark:invert)
  return (
    <img
      src={src}
      alt={alt}
      className={`h-6 w-6 flex-shrink-0 object-contain transition-all ${
        active 
          ? 'brightness-0 invert' 
          : 'brightness-0 opacity-70 dark:invert dark:opacity-90'
      }`}
    />
  );
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const currentUser = useEmployeeStore((state) => state.currentUser);

  const isActive = (item: NavItem) => {
    const currentPath = location.pathname;
    if (item.path === '/dashboard') return currentPath === '/dashboard';
    if (item.matchPaths) return item.matchPaths.some((p) => currentPath.startsWith(p));
    return currentPath === item.path || currentPath.startsWith(item.path + '/');
  };

  const mainSections = [
    { title: 'Mon Espace', keys: ['my-profile'] },
    { title: 'Ressources Humaines', keys: ['employees', 'calendar', 'pointage', 'conges', 'planning', 'performance', 'documents'] },
    { title: 'Finance & Paie', keys: ['paie', 'expenses'] },
    { title: 'Analyse', keys: ['statistiques'] },
  ];

  const getFilteredSections = () => {
    if (!currentUser) return mainSections;
    
    return mainSections.map(section => {
      let keys = [...section.keys];
      if (currentUser.systemRole === 'EMPLOYEE') {
        // Employee sees: Mon Profil, Pointage, Congés
        keys = keys.filter(k => ['my-profile', 'pointage', 'conges'].includes(k));
      }
      return { ...section, keys };
    }).filter(section => section.keys.length > 0);
  };

  const filteredSections = getFilteredSections();

  const findVisibleItem = (key: string) => NAV_ITEMS.find((item) => item.key === key);

  const renderNavLink = (item: NavItem) => {
    const active = isActive(item);
    return (
      <Link
        key={item.key}
        to={item.path}
        className={sidebarNavLinkClass(collapsed, active)}
        aria-current={active ? 'page' : undefined}
      >
        <NavIcon src={item.icon} alt={item.label} active={active} />
        {!collapsed && <span className={sidebarNavLabelClass}>{item.label}</span>}
      </Link>
    );
  };

  const renderSection = (section: { title: string; keys: readonly string[] }) => {
    const items = section.keys
      .map((key) => findVisibleItem(key))
      .filter((item): item is NavItem => !!item);

    if (!items.length) return null;

    return (
      <div key={section.title} className={sidebarSectionWrapClass(collapsed)}>
        {!collapsed && <p className={sidebarSectionTitleClass}>{section.title}</p>}
        {items.map(renderNavLink)}
      </div>
    );
  };

  const settingsItem = findVisibleItem('settings');

  return (
    <aside className={sidebarAsideClass(collapsed)} role="navigation" aria-label="RH navigation">
      <Link to="/dashboard" className={sidebarLogoLinkClass(collapsed)}>
        {collapsed ? (
          <img src="/icone.png" alt="EcoPilot" className="h-10 w-10 object-contain" />
        ) : (
          <div className="flex items-center gap-2">
            <img src="/icone.png" alt="EcoPilot icône" className="h-10 w-10 flex-shrink-0 object-contain" />
            <span className="text-xl font-bold tracking-tight text-[#1B4591] dark:text-white">EcoPilot RH</span>
          </div>
        )}
      </Link>

      <nav className={sidebarNavClass(collapsed)}>
        <div className={sidebarNavMainClass}>
          {(() => {
            const homeItem = findVisibleItem('dashboard');
            if (!homeItem) return null;
            return renderNavLink(homeItem);
          })()}

          {filteredSections.map(renderSection)}
        </div>

        {settingsItem && (
          <div className={sidebarNavFooterClass}>{renderNavLink(settingsItem)}</div>
        )}
      </nav>
    </aside>
  );
}
