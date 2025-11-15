import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  // create a new note with a default title
  const note = await prisma.note.create({
    data: { title: "Untitled note" },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // redirect the browser to the new note page
  return NextResponse.redirect(new URL(`/notes/${note.id}`, baseUrl));
}
