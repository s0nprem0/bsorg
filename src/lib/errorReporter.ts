interface ErrorPayload {
  message: string;
  error?: { name: string; message: string; stack?: string };
  context?: Record<string, unknown>;
  timestamp: string;
}

class ErrorReporter {
  private static instance: ErrorReporter;

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  capture(error: unknown, context?: Record<string, unknown>): void {
    const payload: ErrorPayload = {
      message: error instanceof Error ? error.message : String(error),
      error: error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : undefined,
      context,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.PROD) {
      console.error('[ErrorReporter]', payload.message);
    } else {
      console.group('[ErrorReporter]');
      console.error('Message:', payload.message);
      if (payload.error?.stack) console.error('Stack:', payload.error.stack);
      if (payload.context) console.error('Context:', payload.context);
      console.groupEnd();
    }
  }
}

export const errorReporter = ErrorReporter.getInstance();
