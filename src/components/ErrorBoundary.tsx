import React from 'react';
import { errorReporter } from '@/lib/errorReporter';
import { Button } from '@/components/ui/shadcn/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorReporter.capture(error, {
      source: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="max-h-32 overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
                {this.state.error.message}
                {'\n'}
                {this.state.error.stack}
              </pre>
            )}
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={this.handleRetry}>
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
