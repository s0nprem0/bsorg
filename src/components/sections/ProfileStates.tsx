import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';

export function NotFoundState() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <SearchX className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Organization Not Found</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The organization you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <Link to="/org">
            <ArrowLeft size={16} />
            Back to Organizations
          </Link>
        </Button>
      </div>
    </div>
  );
}