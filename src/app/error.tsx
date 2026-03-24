'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Segment Error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full border border-border bg-card p-6 space-y-4">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          The page failed to load correctly. You can try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
