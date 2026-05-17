import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

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
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 sm:gap-8 md:grid-cols-3">
          {/* Branding Section */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-flex w-fit items-center gap-2">
              <span className="text-xl font-bold text-black">Student Orgs</span>
            </Link>
            <p className="max-w-sm text-sm text-neutral-600">
              Discover and connect with student organizations across campus.
            </p>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-4 text-sm font-semibold text-black">
                  {category}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-neutral-600 transition-colors hover:text-black"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-black">Follow Us</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-black"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-neutral-200" />

        {/* Footer Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-neutral-600">
            © {currentYear} Student Organization Directory. All rights reserved.
          </p>
          <div className="flex gap-6">
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
