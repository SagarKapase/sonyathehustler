/** Renders text, turning `backtick` spans into inline code. */
export function RichText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code
            key={index}
            className="rounded border border-zinc-200 bg-zinc-50 px-1 py-px font-mono text-[0.85em] text-zinc-800"
          >
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
