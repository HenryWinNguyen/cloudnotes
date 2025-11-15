"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type Cell = { id: string; type: "markdown" | "code"; content: string };

export default function NotePage() {
  const { id } = useParams<{ id: string }>();

  // temporary local state until we wire Postgres
  const [cells, setCells] = useState<Cell[]>([
    { id: "c1", type: "markdown", content: "## Welcome\nThis is a markdown cell." },
    { id: "c2", type: "code", content: 'print("Hello from Python")' },
  ]);

  function addCell(type: "markdown" | "code") {
    const newCell: Cell = {
      id: crypto.randomUUID(),
      type,
      content: type === "markdown" ? "New markdown" : "# New code",
    };
    setCells((prev) => [...prev, newCell]);
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Sidebar */}
      <aside className="col-span-3 rounded-2xl border border-white/10 p-3">
        <div className="mb-2 text-sm font-semibold opacity-80">Notes</div>
        <div className="space-y-1">
          <Link href="/notes/demo-1" className="block rounded-md px-2 py-1 hover:bg-white/10">
            Welcome to CloudNotes
          </Link>
          <Link href="/notes/demo-2" className="block rounded-md px-2 py-1 hover:bg-white/10">
            Sample note with code
          </Link>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            onClick={() => addCell("markdown")}
          >
            + Markdown
          </button>
          <button
            className="flex-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
            onClick={() => addCell("code")}
          >
            + Code
          </button>
        </div>
      </aside>

      {/* Editor center */}
      <section className="col-span-6 rounded-2xl border border-white/10 p-3 space-y-3">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Note: {String(id)}</h2>
        </div>

        {cells.map((cell) => (
          <div key={cell.id} className="rounded-xl border border-white/10 p-3">
            <div className="text-xs opacity-60 mb-2">{cell.type.toUpperCase()} CELL</div>
            {cell.type === "markdown" ? (
              <textarea
                className="w-full bg-transparent outline-none resize-y min-h-[120px]"
                value={cell.content}
                onChange={(e) =>
                  setCells((prev) =>
                    prev.map((c) =>
                      c.id === cell.id ? { ...c, content: e.target.value } : c
                    )
                  )
                }
              />
            ) : (
              <textarea
                className="w-full font-mono text-sm bg-transparent outline-none resize-y min-h-[140px]"
                value={cell.content}
                onChange={(e) =>
                  setCells((prev) =>
                    prev.map((c) =>
                      c.id === cell.id ? { ...c, content: e.target.value } : c
                    )
                  )
                }
              />
            )}
          </div>
        ))}
      </section>

      {/* Run panel */}
      <aside className="col-span-3 rounded-2xl border border-white/10 p-3">
        <div className="mb-2 text-sm font-semibold opacity-80">Run panel</div>
        <button
          className="w-full rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => alert("Run cell stub. We will wire Docker later.")}
        >
          Run selected cell
        </button>
        <div className="mt-3 text-xs opacity-70">
          Logs will appear here when the runner is connected.
        </div>
      </aside>
    </div>
  );
}
