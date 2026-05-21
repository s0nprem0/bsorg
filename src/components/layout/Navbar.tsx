// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/shadcn/sheet';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // We only keep the scroll effect, as this legitimately requires syncing with the DOM window
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Browse', href: '/org', end: true },
    { label: 'Directory', href: '/directory' },
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
          <Link
            to="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="h-8 w-8 flex items-center justify-center shadow-sm">
              <img className="h-8 w-8" src="/org.svg" />
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
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              Overview
            </NavLink>
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                end={Boolean(link.end)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            asChild
            className="shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Link to="/org">Explore Directory</Link>
          </Button>
        </div>

        {/* Mobile Navigation Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle navigation menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-75 sm:w-100">
            <div className="flex flex-col gap-6 pt-10">
              {/* Fix: Added onClick={() => setIsOpen(false)} to all mobile links */}
              <NavLink
                to="/"
                end
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-primary"
              >
                Overview
              </NavLink>

              {navLinks.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-4 border-t">
                <Button
                  asChild
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/org">Explore Directory</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
