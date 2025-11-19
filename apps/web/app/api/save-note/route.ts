// app/api/save-note/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingCell = {
  id: string;
  type: "markdown" | "code";
  content: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, cells } = body as { id?: string; cells?: IncomingCell[] };

    if (!id || !cells) {
      return NextResponse.json(
        { error: "Missing note id or cells" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Figure out which cells to delete
      const existing = await tx.cell.findMany({
        where: { noteId: id },
        select: { id: true },
      });

      const incomingIds = new Set(cells.map((c) => c.id));
      const toDelete = existing
        .map((c) => c.id)
        .filter((cellId) => !incomingIds.has(cellId));

      if (toDelete.length > 0) {
        await tx.cell.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      // Upsert all cells with their new order
      for (let index = 0; index < cells.length; index++) {
        const cell = cells[index];

        await tx.cell.upsert({
          where: { id: cell.id },
          update: {
            type: cell.type,
            content: cell.content,
            order: index,
          },
          create: {
            id: cell.id,
            noteId: id,
            type: cell.type,
            content: cell.content,
            order: index,
          },
        });
      }

      // Touch updatedAt on note
      await tx.note.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("save-note error", err);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
