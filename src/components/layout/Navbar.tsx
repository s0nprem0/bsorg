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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Browse', href: '/organization', end: true },
    { label: 'Academic', href: '/organization/acad-org' },
    { label: 'Non-Academic', href: '/organization/non-acadorg' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b supports-backdrop-filter:backdrop-blur-xl ${
        isScrolled
          ? 'border-neutral-200 bg-white/90 shadow-sm'
          : 'border-transparent bg-white'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-neutral-100">
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight text-black">
              BetterOSAS
            </h1>
            <span className="text-xs text-neutral-500 -mt-0.5">
              Student Organization Directory
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-1 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'text-neutral-600 hover:text-black hover:bg-white'
              }`
            }
          >
            Home
          </NavLink>

          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={Boolean(link.end)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-neutral-600 hover:text-black hover:bg-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <Link
            to="/organization"
            className="inline-flex items-center rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Explore Organizations
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls={mobileMenuId}
          className="rounded-xl p-2 text-neutral-700 transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div
        id={mobileMenuId}
        className={`md:hidden overflow-hidden transition-all duration-300 border-t border-neutral-200 ${
          isOpen ? 'max-h-112 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div ref={mobileMenuRef} className="bg-white px-5 py-6">
          <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-2">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:bg-white'
                }`
              }
            >
              Home
            </NavLink>

            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={Boolean(link.end)}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:bg-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/organization"
              onClick={closeMenu}
              className="mt-3 rounded-xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Explore Organizations
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;