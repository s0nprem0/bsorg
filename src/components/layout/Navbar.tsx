import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { X, Menu } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Close mobile menu automatically on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Browse', href: '/organization', end: true },
    { label: 'Academic', href: '/organization/acad-org' },
    { label: 'Non-Academic', href: '/organization/non-acadorg' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? 'border-border bg-background/80 backdrop-blur-xl shadow-sm'
          : 'border-transparent bg-background'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center shadow-sm">
               <span className="text-background text-sm font-extrabold">B</span>
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              BetterOSAS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-foreground-secondary'
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
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-foreground-secondary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/organization"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background shadow-sm"
          >
            Explore Directory
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 -mr-2 text-foreground-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-nav-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-background border-border ${
          isOpen ? 'max-h-[400px] border-t opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div ref={mobileMenuRef} className="flex flex-col px-6 py-6 space-y-5">
          <NavLink to="/" end className="text-base font-medium text-foreground-secondary hover:text-primary">
            Overview
          </NavLink>
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground-secondary hover:text-primary'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-4 mt-2 border-t border-border">
            <Link
              to="/organization"
              className="flex w-full h-10 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-semibold text-background transition-colors"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}