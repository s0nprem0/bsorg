import type { JSX } from 'react';
import { Mail, Globe } from 'lucide-react';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

const iconMap: Record<string, (size: number) => JSX.Element> = {
  email: (size: number) => <Mail size={size} />,
  website: (size: number) => <Globe size={size} />,
  facebook: (size: number) => <FaFacebook size={size} />,
  instagram: (size: number) => <FaInstagram size={size} />,
  tiktok: (size: number) => <FaTiktok size={size} />,
  x: (size: number) => <FaXTwitter size={size} />,
  youtube: (size: number) => <FaYoutube size={size} />,
};

export function ContactIcon({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) {
  const render = iconMap[name];
  if (!render) return null;
  return render(size);
}
