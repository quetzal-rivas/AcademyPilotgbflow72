export default function DashboardHandshakePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-black uppercase tracking-tight">Completing Handshake</h1>
        <p className="text-sm text-muted-foreground">
          Processing your secure sign-in link and routing you to your academy dashboard.
        </p>
      </div>
    </main>
  );
}
