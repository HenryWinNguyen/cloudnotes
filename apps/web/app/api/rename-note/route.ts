import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { id, title } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing note id" },
      { status: 400 },
    );
  }

  await prisma.note.update({
    where: { id },
    data: {
      title: title || "Untitled note",
    },
  });

  return NextResponse.json({ ok: true });
}
