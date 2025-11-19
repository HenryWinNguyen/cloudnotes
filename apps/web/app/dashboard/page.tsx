import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteNoteButton from "@/components/DeleteNoteButton";
import RenameNoteButton from "@/components/RenameNoteButton";

export default async function DashboardPage() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <div className="min-h-full">
      <div className="max-w-6xl mx-auto pt-8 pb-16 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm opacity-70">
              Your runnable CloudNotes workspace.
            </p>
          </div>

          <form action="/api/create-note" method="post">
            <button
              type="submit"
              className="rounded-full border border-sky-400/50 bg-sky-500/20 px-6 py-2 text-sm
                         hover:bg-sky-400/30 active:scale-[0.96] transition shadow-sm"
            >
              New note
            </button>
          </form>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-6 py-14 text-center text-sm opacity-70">
            You do not have any notes yet. Create your first note to start experimenting.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center px-2">
            {notes.map((n) => (
              <div key={n.id} className="w-full max-w-sm space-y-2">
                {/* Card */}
                <Link
                  href={`/notes/${n.id}`}
                  className="group block rounded-3xl border border-white/10 bg-gradient-to-br
                    from-sky-500/20 via-white/[0.03] to-purple-500/10
                    p-6 min-h-[180px]
                    hover:border-sky-400/70 hover:bg-sky-500/20
                    hover:shadow-[0_0_40px_rgba(56,189,248,0.35)]
                    hover:-translate-y-1
                    transition-all duration-200 ease-out"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-lg font-medium truncate">
                      {n.title || "Untitled note"}
                    </div>
                  </div>

                  <div className="mt-3 text-xs opacity-70">
                    Last updated {new Date(n.updatedAt).toLocaleString()}
                  </div>

                  <div
                    className="mt-6 text-[11px] uppercase tracking-wide opacity-60
                               group-hover:opacity-100 group-hover:text-sky-200 transition"
                  >
                    Open note →
                  </div>
                </Link>

                {/* Rename + Delete under the card */}
                <div className="flex items-center justify-between px-1">
                  <RenameNoteButton
                    noteId={n.id}
                    currentTitle={n.title || "Untitled note"}
                  />
                </div>

                <DeleteNoteButton id={n.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
