import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-neutral-200 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          The organization or page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}