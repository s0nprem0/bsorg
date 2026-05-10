import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import {
  NavLink,
  Link,
} from 'react-router-dom';

import {
  X,
  Menu,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] =
    useState(false);

  const mobileMenuRef =
    useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener(
      'scroll',
      handleScroll,
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        closeMenu();
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, [closeMenu]);

  const navLinks = [
    {
      label: 'Browse',
      href: '/browse',
    },
    {
      label: 'Academic',
      href: '/acadorg',
    },
    {
      label: 'Non-Academic',
      href: '/non-acadorg',
    },
    {
      label: 'Colleges',
      href: '/college',
    },
    {
      label: 'PAG',
      href: '/pag',
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl'
          : 'bg-white'
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight text-black">
              BetterOSAS
            </h1>

            <span className="text-xs text-neutral-500">
              Student Organization Directory
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`
            }
          >
            Home
          </NavLink>

          {navLinks.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            to="/browse"
            className="inline-block rounded-2xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]"
          >
            Explore
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          className="rounded-xl p-2 text-neutral-700 transition hover:bg-neutral-100 md:hidden"
        >
          {isOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isOpen
            ? 'max-h-96 border-t border-neutral-200 opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <div
          ref={mobileMenuRef}
          className="bg-white/95 px-5 py-5 backdrop-blur"
        >
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`
              }
            >
              Home
            </NavLink>

            {navLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/browse"
              onClick={closeMenu}
              className="mt-4 rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
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