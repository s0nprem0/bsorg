// src/components/sections/Hero.tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32 border-b border-border/50">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:24px_24px]"></div>

      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[37.5rem] h-[25rem] bg-primary/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center z-10">
        <img
          src="/hero.png"
          alt=""
          aria-hidden="true"
          className="absolute -top-20 right-0 w-80 sm:w-96 opacity-10 sm:opacity-20 pointer-events-none select-none"
        />
        <Badge
          variant="secondary"
          className="mb-8 bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1.5 text-sm backdrop-blur-sm shadow-sm"
        >
          Discover Your Community
        </Badge>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
          Find the heartbeat of <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/70">
            Cavite State University
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The definitive guide to CvSU programs and recognized student
          organizations. Explore chapters, connect with leaders, and build your
          campus network.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 font-bold shadow-lg hover:shadow-primary/25 transition-all text-primary-foreground"
          >
            <Link to="/org">
              Start Exploring <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="h-12 px-8 font-semibold text-muted-foreground hover:text-foreground"
          >
            <a href="#featured">View Featured</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
