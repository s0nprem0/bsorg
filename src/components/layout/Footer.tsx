import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa6';
import { Button } from '@/components/ui/shadcn/button';
import { Separator } from '@/components/ui/shadcn/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Directory: [
      { label: 'Browse All Orgs', href: '/org' },
      { label: 'Academic Orgs', href: '/org?type=Academic' },
      { label: 'Non-Academic Orgs', href: '/org?type=Non-Academic' },
    ],
    About: [
      { label: 'About BetterOSAS', href: 'https://github.com/s0nprem0/bsorg' },
      { label: 'Submit Feedback', href: 'https://github.com/s0nprem0/bsorg/issues' },
    ],
  };

  const socialLinks = [
    {
      icon: FaGithub,
      href: 'https://github.com/s0nprem0/bsorg',
      label: 'GitHub Repository',
    },
  ];

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 sm:gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="flex flex-col gap-4 md:col-span-2 pr-8">
            <Link to="/" className="inline-flex w-fit items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
                BetterOSAS
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              The definitive, student-led directory for exploring academic,
              cultural, and special interest organizations across the Cavite
              State University network.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.label}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-10 bg-border/50" />

        {/* Bottom Bar: Copyright & Socials */}
        <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-medium text-muted-foreground">
            © {currentYear} BetterOSAS. Built by students, for students.
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map(social => (
              <Button
                key={social.label}
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-full"
              >
                <a
                  href={social.href}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
