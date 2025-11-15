import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  // Load notes from Neon via Prisma
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        {/* This posts to /api/create-note */}
        <form action="/api/create-note" method="post">
          <button
            type="submit"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
          >
            New Note
          </button>
        </form>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((n) => (
          <Link
            key={n.id}
            href={`/notes/${n.id}`}
            className="rounded-2xl border border-white/10 p-4 hover:bg-white/5"
          >
            <div className="text-lg font-medium">{n.title}</div>
            <div className="text-xs opacity-60 mt-1">
              Last updated {new Date(n.updatedAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
