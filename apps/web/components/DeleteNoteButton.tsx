"use client";

export default function DeleteNoteButton({ id }: { id: string }) {
  return (
    <form
      action="/api/delete-note"
      method="post"
      className="text-right"
      onSubmit={(e) => {
        if (!confirm("Delete this note forever?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[11px] uppercase tracking-wide opacity-60 hover:opacity-100 hover:text-red-300 transition"
      >
        Delete
      </button>
    </form>
  );
}
