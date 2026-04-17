import { useCallback, useEffect, useRef, useState } from 'react'
import { openaiApiKey, openaiModel } from '../config'
import { sendChatCompletion } from '../api/chat'
import { usePersistedChat } from '../hooks/usePersistedChat'
import { ChatEntryCard } from './ChatEntryCard'
import { PromptComposer } from './PromptComposer'

export function PromptCraftApp() {
  const keyConfigured = Boolean(openaiApiKey?.trim())
  const { entries, appendEntry, clearHistory, buildMessagesForApi } =
    usePersistedChat()
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const bottomRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [entries.length, isSubmitting, scrollToBottom])

  const handleSubmit = useCallback(async () => {
    const text = prompt.trim()
    if (!text || isSubmitting || !keyConfigured) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const messages = buildMessagesForApi(text)
      const response = await sendChatCompletion(messages)
      appendEntry({
        id: crypto.randomUUID(),
        prompt: text,
        response,
        createdAt: Date.now(),
      })
      setPrompt('')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsSubmitting(false)
    }
  }, [
    appendEntry,
    buildMessagesForApi,
    isSubmitting,
    keyConfigured,
    prompt,
  ])

  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 dark:bg-neutral-950">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              PromptCraft
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Model: {openaiModel}
              {!keyConfigured && ' · API key missing'}
            </p>
          </div>
          <button
            type="button"
            onClick={clearHistory}
            disabled={entries.length === 0}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            Clear
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-4 pt-4">
        {!keyConfigured && (
          <div
            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            Copy <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">.env.example</code> to{' '}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">.env</code>, set{' '}
            <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">VITE_OPENAI_API_KEY</code>, then
            restart <code className="rounded bg-amber-100/80 px-1 dark:bg-amber-900/60">npm run dev</code>.
          </div>
        )}

        {submitError && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-100"
            role="alert"
          >
            <span className="font-medium">Could not get a response.</span>{' '}
            {submitError}
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
          {entries.length === 0 && !isSubmitting && (
            <p className="rounded-xl border border-dashed border-neutral-300 bg-white/60 px-4 py-8 text-center text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/40 dark:text-neutral-400">
              No messages yet. Send a prompt below — your history saves in this
              browser.
            </p>
          )}
          {entries.map((entry) => (
            <ChatEntryCard key={entry.id} entry={entry} />
          ))}
          <div ref={bottomRef} aria-hidden />
        </div>
      </main>

      <div className="sticky bottom-0 mx-auto w-full max-w-2xl">
        <PromptComposer
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleSubmit}
          disabled={!keyConfigured}
          loading={isSubmitting}
        />
      </div>
    </div>
  )
}
