import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';

function Skeleton({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card/50 animate-pulse ${className ?? ''}`} />;
}

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-56 sm:h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Skeleton className="md:col-span-2 lg:col-span-2 md:row-span-2 h-[420px]" />
          <Skeleton className="md:col-span-1 lg:col-span-1 h-48" />
          <Skeleton className="md:col-span-1 lg:col-span-1 h-48" />
          <Skeleton className="md:col-span-3 lg:col-span-2 h-40" />
        </div>
      </main>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Error Loading Organization</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
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
            The organization you're looking for doesn't exist or may have been moved.
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
