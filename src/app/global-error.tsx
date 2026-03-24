'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global App Error:', error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
        <main className="max-w-md w-full border border-border bg-card p-6 space-y-4">
          <h1 className="text-xl font-bold">Unexpected application error</h1>
          <p className="text-sm text-muted-foreground">
            A critical error occurred. Please retry the last action.
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground"
          >
            Reload state
          </button>
        </main>
      </body>
    </html>
  );
}
