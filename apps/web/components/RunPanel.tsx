// components/RunPanel.tsx
"use client";

import { useState } from "react";

type RunPanelProps = {
  noteId: string;
  lastCodeCell: string | null;
};

type Language = "python" | "cpp";

export default function RunPanel({ noteId, lastCodeCell }: RunPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string>("");
  const [language, setLanguage] = useState<Language>("python");

  const hasOutput = logs.trim().length > 0;

  async function handleRun() {
    if (!lastCodeCell || !lastCodeCell.trim()) {
      setLogs("No code cell to run.");
      return;
    }

    setIsRunning(true);
    setLogs(""); // clear so we show fresh output each run

    try {
      const res = await fetch("/api/run-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, language }),
      });

      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; log?: string }
        | null;

      if (!data) {
        setLogs("Run failed (bad JSON response).");
        return;
      }

      if (!res.ok || !data.ok) {
        setLogs(data.log || "Run failed.");
      } else {
        setLogs(data.log ?? "(no output)");
      }
    } catch {
      setLogs("Run failed (network error).");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <aside className="h-full rounded-2xl border border-sky-500/40 bg-slate-950/90 p-4 flex flex-col shadow-xl shadow-sky-900/40">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-sky-400">
            Run panel
          </div>
          <div className="text-[11px] text-slate-400">
            Executes the last code cell in an isolated Docker container.
          </div>
        </div>

        <select
          className="rounded-md border border-sky-500/60 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/80"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          disabled={isRunning}
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Centered button, smaller width */}
      <div className="mb-3 flex justify-center">
        <button
          type="button"
          onClick={handleRun}
          disabled={isRunning}
          className="w-full max-w-xs rounded-md border border-sky-400/80 bg-sky-500/20 px-3 py-2 text-sm font-medium
                     hover:bg-sky-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? "Running…" : "Run last code cell"}
        </button>
      </div>

      {/* Status line */}
      <div className="mb-2 text-[11px] text-slate-400">
        Limits: 1 container per run, ~256 MB memory, no network, timeout after a few seconds.
      </div>

      {/* Output area */}
      <div className="mt-1 flex-1 border border-white/10 rounded-xl bg-black/60 overflow-auto">
        {hasOutput ? (
          <pre className="p-3 text-xs font-mono whitespace-pre-wrap text-left text-slate-100">
            {logs}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center p-3 text-xs font-mono text-slate-500">
            (no output yet)
          </div>
        )}
      </div>
    </aside>
  );
}
