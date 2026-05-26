import React, { type JSX } from 'react';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { Mail, Globe } from 'lucide-react';

export const CONTACT_ICONS: Record<string, (large: boolean) => JSX.Element> = {
  email: (large: boolean) =>
    React.createElement(Mail, { size: large ? 24 : 18 }),
  website: (large: boolean) =>
    React.createElement(Globe, { size: large ? 24 : 18 }),
  facebook: (large: boolean) =>
    React.createElement(FaFacebook, { size: large ? 24 : 18 }),
  instagram: (large: boolean) =>
    React.createElement(FaInstagram, { size: large ? 24 : 18 }),
  tiktok: (large: boolean) =>
    React.createElement(FaTiktok, { size: large ? 24 : 18 }),
  x: (large: boolean) =>
    React.createElement(FaXTwitter, { size: large ? 24 : 18 }),
  youtube: (large: boolean) =>
    React.createElement(FaYoutube, { size: large ? 24 : 18 }),
};
