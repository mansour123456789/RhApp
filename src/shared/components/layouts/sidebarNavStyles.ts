import { cn } from '@/shared/lib/utils';

/** Sidebar admin — aligné maquette (capture 2). */
export const sidebarAsideClass = (collapsed: boolean) =>
  cn(
    'fixed left-0 top-0 z-40 hidden h-dvh max-h-dvh flex-col overflow-hidden border-r lg:flex',
    'bg-white border-[#E6EAF2] text-[#263248]',
    'dark:bg-sidebar dark:border-sidebar-border dark:text-sidebar-foreground',
    collapsed ? 'w-[88px]' : 'w-[248px]',
  );

export const sidebarLogoLinkClass = (collapsed: boolean) =>
  cn(
    'flex shrink-0 items-center border-b border-[#F1F4F9] py-6 dark:border-sidebar-border',
    collapsed ? 'justify-center px-2' : 'justify-center px-3',
  );

/** Colonne nav : contenu haut + pied fixé en bas via mt-auto */
export const sidebarNavClass = (collapsed: boolean) =>
  cn(
    'flex min-h-0 flex-1 flex-col overflow-hidden',
    collapsed ? 'px-2 pt-4 pb-5' : 'px-4 pt-5 pb-6',
  );

/** Zone scrollable : évite que les liens soient coupés à 100 % zoom / petits écrans. */
export const sidebarNavMainClass =
  'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin]';

export const sidebarNavFooterClass = 'mt-auto shrink-0 border-t border-[#F1F4F9] bg-white pt-2 dark:border-sidebar-border dark:bg-sidebar';

export const sidebarNavLinkClass = (collapsed: boolean, active: boolean) =>
  cn(
    'flex min-h-[44px] items-center gap-3 rounded-full transition-colors',
    collapsed ? 'justify-center' : 'px-4',
    active
      ? 'bg-[#1B4591] text-white shadow-sm'
      : 'text-[#263248] hover:bg-[#F2F5FB] dark:text-sidebar-foreground/90 dark:hover:bg-white/[0.08]',
  );

export const sidebarSectionWrapClass = (collapsed: boolean) =>
  cn(collapsed ? 'mt-2 space-y-2' : 'mt-0 space-y-0');

export const sidebarSectionTitleClass =
  'px-4 pb-1 pt-4 text-sm font-semibold leading-snug tracking-wide text-[#2762C4] dark:text-primary';

export const sidebarNavLabelClass = 'truncate text-sm font-medium leading-snug';
