import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/shadcn/button';
import { Separator } from '@/components/ui/shadcn/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Resources: [
      { label: 'Browse Organizations', href: '/orgbrowser' },
      { label: 'Academic Orgs', href: '/acadorg' },
      { label: 'Non-Academic Orgs', href: '/non-acadorg' },
      { label: 'By College', href: '/college' },
    ],
    About: [
      { label: 'About Us', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Feedback', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTiktok, href: '#', label: 'TikTok' },
    { icon: FaXTwitter, href: '#', label: 'X' },
  ];

return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 sm:gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-flex w-fit items-center gap-2">
              <span className="text-xl font-bold text-foreground">Student Orgs</span>
            </Link>
            <p className="max-w-sm text-sm text-foreground-secondary">
              Discover and connect with student organizations across campus.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-semibold text-foreground">
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-foreground-secondary transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button key={social.label} variant="outline" size="icon" asChild className="text-foreground-secondary hover:text-foreground">
                  <a href={social.href} title={social.label} target="_blank" rel="noopener noreferrer">
                    <social.icon size={18} />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-foreground-secondary">
            © {currentYear} Student Organization Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;