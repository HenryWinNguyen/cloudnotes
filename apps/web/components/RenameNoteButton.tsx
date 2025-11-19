"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RenameNoteButton({
  noteId,
  currentTitle,
}: {
  noteId: string;
  currentTitle: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const nextTitle = prompt("Rename note:", currentTitle || "Untitled note");
    if (nextTitle == null) return; // cancelled

    startTransition(async () => {
      const res = await fetch("/api/rename-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: noteId,
          title: nextTitle,
        }),
      });

      if (!res.ok) {
        alert("Failed to rename note.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-[11px] uppercase tracking-wide opacity-60 hover:opacity-100 hover:text-sky-300 transition"
    >
      {isPending ? "Renaming..." : "Rename"}
    </button>
  );
}
