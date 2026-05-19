import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold tracking-tighter text-border-strong mb-6">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-foreground-secondary mb-10 max-w-md mx-auto">
          The organization or page you're looking for doesn't exist, has been moved, or is currently unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface-1 px-6 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
        >
          <ArrowLeft size={16} />
          Return to Overview
        </Link>
      </div>
    </div>
  );
}