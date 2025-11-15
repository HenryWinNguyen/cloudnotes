import { prisma } from "../lib/prisma";

async function main() {
  const note1 = await prisma.note.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000001", title: "Welcome to CloudNotes" },
  });

  await prisma.cell.createMany({
    data: [
      { noteId: note1.id, order: 1, type: "markdown", content: "## Welcome\nThis is a markdown cell." },
      { noteId: note1.id, order: 2, type: "code", content: 'print("Hello from Python")' },
    ],
    skipDuplicates: true,
  });

  await prisma.note.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000002", title: "Sample note with code" },
  });

  console.log("✅ Seeded demo notes successfully.");
}

main().finally(() => process.exit(0));
