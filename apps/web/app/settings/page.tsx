export default function SettingsPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm opacity-70">
            Configuration for CloudNotes will live here. For now this is a placeholder so you
            don&apos;t hit a 404 from the navbar.
          </p>
        </div>
  
        <div className="rounded-2xl border border-white/10 p-4 space-y-4">
          <h2 className="text-lg font-medium">Runner configuration (coming soon)</h2>
          <p className="text-sm opacity-70">
            Eventually this page will let you configure which languages are enabled, resource
            limits for code execution, and other Docker runner options.
          </p>
        </div>
  
        <div className="rounded-2xl border border-white/10 p-4 space-y-3">
          <h2 className="text-lg font-medium">Appearance (future)</h2>
          <p className="text-sm opacity-70">
            Later you could add theme options here so CloudNotes visually matches your portfolio.
          </p>
        </div>
      </div>
    );
  }
  