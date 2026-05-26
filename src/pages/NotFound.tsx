import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';
import SEO from '@/components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-9xl font-bold tracking-tighter text-surface-2 mb-6">
            404
          </h1>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-10 max-w-md mx-auto">
          The organization or page you're looking for doesn't exist, has been moved, or is currently unavailable.
        </p>
        <Button variant="outline" size="lg" asChild className="gap-2">
          <Link to="/">
            <ArrowLeft size={16} />
            Return to Overview
          </Link>
        </Button>
        </div>
      </div>
    </>
  );
}