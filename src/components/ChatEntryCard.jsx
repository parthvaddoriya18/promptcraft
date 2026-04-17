function formatTime(ts) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(ts))
  } catch {
    return ''
  }
}

/** @param {{ entry: { id: string; prompt: string; response: string; createdAt: number } }} props */
export function ChatEntryCard({ entry }) {
  return (
    <article
      className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      aria-labelledby={`prompt-${entry.id}`}
    >
      <p
        id={`prompt-${entry.id}`}
        className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
      >
        You · {formatTime(entry.createdAt)}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-neutral-900 dark:text-neutral-100">
        {entry.prompt}
      </p>
      <hr className="my-4 border-neutral-200 dark:border-neutral-800" />
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Assistant
      </p>
      <p className="mt-2 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
        {entry.response}
      </p>
    </article>
  )
}
