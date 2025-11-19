// app/notes/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import NoteEditor, { type EditorCell } from "@/components/NoteEditor";
import RunPanel from "@/components/RunPanel";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="p-6 text-sm opacity-70">
        Note not found (missing id).
      </div>
    );
  }

  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      cells: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!note) {
    return (
      <div className="p-6 text-sm opacity-70">
        Note not found.
      </div>
    );
  }

  const initialCells: EditorCell[] =
    note.cells.length > 0
      ? note.cells.map((c) => ({
          id: c.id,
          type: c.type as "markdown" | "code",
          content: c.content,
        }))
      : [
          {
            id: crypto.randomUUID(),
            type: "markdown",
            content: "## Welcome\nThis is a markdown cell.",
          },
          {
            id: crypto.randomUUID(),
            type: "code",
            content: 'for i in range(3):\n    print("Hello from Docker", i)',
          },
        ];

  const lastCodeCell =
    initialCells.filter((c) => c.type === "code").at(-1)?.content ?? null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full">
      {/* center the whole interface with a max width so it doesn't touch the screen edges */}
      <div className="max-w-[1500px] mx-auto">
        <div className="grid w-full gap-6 lg:grid-cols-[2.3fr,1.1fr]">
          {/* Main note editor card */}
          <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-xl shadow-sky-900/30">
            <div className="flex items-start justify-between gap-2">
              {/* Centered CloudNotes title that links back home */}
              <div className="flex-1 text-center">
                <Link
                  href="/"
                  className="inline-block text-sm font-semibold tracking-wide text-sky-400 hover:text-sky-300"
                >
                  CLOUDNOTES
                </Link>
                <h2 className="mt-1 text-lg font-semibold">
                  {note.title || "Untitled note"}
                </h2>
              </div>

              {/* Help toggle on the right */}
              <details className="text-xs text-slate-300">
                <summary className="cursor-pointer rounded-full border border-white/15 bg-slate-900/80 px-3 py-1 text-[11px] hover:bg-slate-800/80">
                  Help
                </summary>
                <div className="mt-2 max-w-xs rounded-md border border-white/10 bg-black/70 p-2">
                  <p className="opacity-80">
                    Use markdown cells for notes and code cells for Python or
                    C++ snippets. The run panel executes the last code cell in
                    an isolated Docker container.
                  </p>
                </div>
              </details>
            </div>

            <NoteEditor noteId={note.id} initialCells={initialCells} />
          </section>

          {/* Run panel card */}
          <RunPanel noteId={note.id} lastCodeCell={lastCodeCell} />
        </div>
      </div>
    </div>
  );
}
