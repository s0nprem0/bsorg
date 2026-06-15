import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalize(text?: string): string {
  return (text ?? '').toLowerCase().trim();
}

export function getSocialEntries(
  contact: { social?: Record<string, string | undefined> } | undefined
): [string, string][] {
  if (!contact?.social) return [];
  return Object.entries(contact.social).filter(
    (entry): entry is [string, string] => !!entry[1]
  );
}
