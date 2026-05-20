// src/components/sections/Hero.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/shadcn/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-24 sm:py-32 border-b border-border">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
          Discover the heartbeat of <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground-muted">
            Cavite State University
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground-secondary">
          The definitive guide to CvSU Main programs and recognized student organizations. Explore chapters, connect with leaders, and build your campus network.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="shadow-sm hover:bg-foreground/90 transition-all">
            <Link to="/organization">Start Exploring</Link>
          </Button>
          <Button asChild variant="link" className="text-foreground hover:text-foreground-secondary transition-colors font-semibold">
            <a href="#featured">View featured <span aria-hidden="true" className="ml-1">→</span></a>
          </Button>
        </div>
      </div>
    </div>
  );
}