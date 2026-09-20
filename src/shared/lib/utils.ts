import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Minuscule + accents retirés — pour comparer/rechercher du texte sans tenir compte des accents. */
export function normalizeAccent(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** `haystack` contient `needle` en ignorant la casse et les accents (ex: "demolition" matche "démolition"). */
export function includesIgnoreAccent(haystack: string | null | undefined, needle: string): boolean {
  return normalizeAccent(haystack).includes(normalizeAccent(needle));
}

export async function downloadFileFromUrl(url: string, defaultFileName: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    
    // Essayer de garder l'extension d'origine si possible, sinon fallback sur le type mime
    let ext = blob.type.split('/')[1] || 'img';
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    let fileName = defaultFileName;
    if (!fileName.includes('.')) fileName += `.${ext}`;
    
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch (e) {
    console.error('Erreur téléchargement fichier:', e);
  }
}
