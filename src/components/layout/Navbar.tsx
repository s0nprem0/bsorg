import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuId = 'mobile-nav-menu';

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Browse', href: '/organization', end: true },
    { label: 'Academic', href: '/organization/acad-org' },
    { label: 'Non-Academic', href: '/organization/non-acadorg' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'border-border bg-background/80 backdrop-blur-md'
          : 'border-transparent bg-background'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center">
               <span className="text-background text-xs font-bold">O</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              BetterOSAS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-foreground' : 'text-foreground-secondary hover:text-foreground'
                }`
              }
            >
              Overview
            </NavLink>
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={Boolean(link.end)}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive ? 'text-foreground' : 'text-foreground-secondary hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/organization"
            className="inline-flex h-8 items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-transform hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
          >
            Explore Directory
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-foreground-secondary hover:text-foreground transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id={mobileMenuId}
        className={`md:hidden overflow-hidden transition-all duration-200 border-t border-border bg-background ${
          isOpen ? 'max-h-96 border-opacity-100' : 'max-h-0 border-opacity-0'
        }`}
      >
        <div ref={mobileMenuRef} className="flex flex-col px-6 py-4 space-y-4">
          <NavLink to="/" end onClick={closeMenu} className="text-sm text-foreground-secondary hover:text-foreground">Overview</NavLink>
          {navLinks.map((link) => (
            <NavLink key={link.href} to={link.href} onClick={closeMenu} className="text-sm text-foreground-secondary hover:text-foreground">
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;