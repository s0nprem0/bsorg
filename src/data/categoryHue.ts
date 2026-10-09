/** Stable hue per category, so every org in a college shares a banner tint and
 *  the 14 categories stay distinguishable from one another.
 *
 *  Hashed from the category rather than the org slug on purpose: hashing the
 *  slug would give sibling orgs in the same college clashing hues, which is
 *  the opposite of what the tint is for. Low saturation and lightness keep it
 *  a backdrop that never competes with a logo. */
export function categoryHue(category: string): number {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) % 360;
  }
  return hash;
}