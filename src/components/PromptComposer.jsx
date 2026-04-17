/** @param {{ value: string; onChange: (v: string) => void; onSubmit: () => void | Promise<void>; disabled: boolean; loading: boolean }} props */
export function PromptComposer({ value, onChange, onSubmit, disabled, loading }) {
  function handleSubmit(e) {
    e.preventDefault()
    if (!disabled && !loading && value.trim()) void onSubmit()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-neutral-200 bg-neutral-50/80 p-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80"
    >
      <label htmlFor="prompt" className="sr-only">
        Prompt
      </label>
      <textarea
        id="prompt"
        name="prompt"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        placeholder={
          disabled
            ? 'Add VITE_OPENAI_API_KEY to .env to enable prompts…'
            : 'Write your prompt and press Send…'
        }
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none ring-violet-500 placeholder:text-neutral-400 focus:border-violet-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
      />
      <div className="mt-3 flex items-center justify-end gap-2">
        {loading && (
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Thinking…
          </span>
        )}
        <button
          type="submit"
          disabled={disabled || loading || !value.trim()}
          className="inline-flex min-w-[5.5rem] items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  )
}
