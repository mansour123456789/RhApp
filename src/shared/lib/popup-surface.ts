/** Surfaces flottantes (modales, popovers) : fond blanc même en thème sombre. */
export const popupLightSurfaceClass =
  'ec-popup-light isolate backdrop-blur-none bg-white text-[#263248] border-[#E8EDF5] dark:bg-white dark:text-[#263248] dark:border-[#E8EDF5]';

/** Voile assombri seul (sans blur — le blur sur le voile passait au-dessus du contenu si z-index incorrect). */
export const modalBackdropClassName = 'fixed inset-0 z-[200] bg-slate-900/50';

/** Contenu modal Radix / portal : toujours au-dessus du voile z-[200]. */
export const modalContentZIndexClass = 'z-[201]';

/** Select, Popover, Dropdown dans une modale — au-dessus du Dialog (z-[201]). */
export const floatingPopoverZIndexClass = 'z-[250]';

/** Wrapper portal : fond + centrage (le contenu enfant doit avoir modalContentZIndexClass ou z-[201]). */
export const modalPortalOverlayClass =
  'fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4';

/** Overlay seul (sans flex), ex. Dialog Radix */
export const modalOverlayClassName = modalBackdropClassName;

export const modalOverlayStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.55)',
} as const;
