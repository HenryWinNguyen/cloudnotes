import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest) {
  const note = await prisma.note.create({
    data: {
      title: "Untitled note",
      cells: {
        create: [
          {
            type: "markdown",
            content: "## Welcome\nThis is a markdown cell.",
            order: 0,
          },
          {
            type: "code",
            content: 'print("Hello from Python")',
            order: 1,
          },
        ],
      },
    },
  });

  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return NextResponse.redirect(new URL(`/notes/${note.id}`, base));
}
