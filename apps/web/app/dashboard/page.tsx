import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <div className="min-h-full">
      <div className="max-w-5xl mx-auto pt-6 pb-12 space-y-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm opacity-70">
              Quick access to your CloudNotes – runnable notes for code experiments.
            </p>
          </div>

          <form action="/api/create-note" method="post">
            <button
              type="submit"
              className="rounded-full border border-sky-400/60 bg-sky-500/10 px-5 py-2 text-sm hover:bg-sky-400/20 active:scale-[0.97] transition"
            >
              New note
            </button>
          </form>
        </div>

        {/* Notes grid */}
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 px-6 py-10 text-center text-sm opacity-70">
            You do not have any notes yet. Create your first note to start experimenting.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
              <Link
                key={n.id}
                href={`/notes/${n.id}`}
                className="group rounded-2xl border border-white/12 bg-gradient-to-br from-sky-500/10 via-white/[0.02] to-emerald-500/10 p-5 min-h-[140px]
                           hover:border-sky-400/70 hover:bg-sky-500/15 shadow-sm hover:shadow-[0_0_28px_rgba(56,189,248,0.4)]
                           transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium truncate">
                    {n.title || "Untitled note"}
                  </div>
                </div>

                <div className="mt-2 text-xs opacity-70">
                  Last updated {new Date(n.updatedAt).toLocaleString()}
                </div>

                <div className="mt-4 text-[11px] uppercase tracking-wide opacity-60 group-hover:opacity-95">
                  Open note →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
