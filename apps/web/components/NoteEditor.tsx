"use client";

import { useState } from "react";

export type EditorCell = {
  id: string;
  type: "markdown" | "code";
  content: string;
};

export default function NoteEditor({
  noteId,
  initialCells,
}: {
  noteId: string;
  initialCells: EditorCell[];
}) {
  const [cells, setCells] = useState<EditorCell[]>(initialCells);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  function addCell(type: "markdown" | "code") {
    const newCell: EditorCell = {
      id: crypto.randomUUID(),
      type,
      content: type === "markdown" ? "New markdown" : "# New code",
    };
    setCells((prev) => [...prev, newCell]);
  }

  function updateCell(id: string, content: string) {
    setCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content } : c)),
    );
  }

  function deleteCell(id: string) {
    setCells((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/save-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteId, cells }),
      });

      if (!res.ok) {
        alert("Failed to save note");
        return;
      }

      setLastSaved(new Date().toLocaleTimeString());
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Controls row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            onClick={() => addCell("markdown")}
          >
            + Markdown
          </button>
          <button
            type="button"
            className="rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            onClick={() => addCell("code")}
          >
            + Code
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs opacity-70">
          {lastSaved && <span>Last saved at {lastSaved}</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md border border-sky-400/60 bg-sky-500/20 px-3 py-1 text-xs hover:bg-sky-400/30 disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Cells list */}
      {cells.map((cell) => (
        <div key={cell.id} className="rounded-xl border border-white/10 p-3">
          <div className="mb-2 flex items-center justify-between text-xs opacity-70">
            <span>{cell.type.toUpperCase()} CELL</span>
            <button
              type="button"
              className="text-[11px] uppercase tracking-wide hover:text-red-300"
              onClick={() => deleteCell(cell.id)}
            >
              Delete
            </button>
          </div>

          <textarea
            className={
              cell.type === "code"
                ? "w-full font-mono text-sm bg-transparent outline-none resize-y min-h-[140px]"
                : "w-full bg-transparent outline-none resize-y min-h-[120px]"
            }
            value={cell.content}
            onChange={(e) => updateCell(cell.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
