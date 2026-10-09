/** Kept out of ProfileTabs.tsx so that file exports only components, which is
 *  what react-refresh needs to swap modules without a full reload. */
export type ProfileTab = 'overview' | 'suborgs' | 'similar';

/** Tab ids double as the ?tab= value. Anything unrecognised falls back to
 *  overview so a hand-edited URL can't land on a panel that doesn't exist. */
export function parseTab(value: string | null): ProfileTab {
  return value === 'suborgs' || value === 'similar' ? value : 'overview';
}