import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'promptcraft-chat-history-v1'

/**
 * @typedef {{ id: string; prompt: string; response: string; createdAt: number }} ChatEntry
 */

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (e) =>
        e &&
        typeof e.id === 'string' &&
        typeof e.prompt === 'string' &&
        typeof e.response === 'string' &&
        typeof e.createdAt === 'number',
    )
  } catch {
    return []
  }
}

export function usePersistedChat() {
  const [entries, setEntries] = useState(loadEntries)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // private mode / quota
    }
  }, [entries])

  const appendEntry = useCallback((entry) => {
    setEntries((prev) => [...prev, entry])
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  /** Builds OpenAI `messages` including prior successful turns + the new user message. */
  const buildMessagesForApi = useCallback(
    (nextUserContent) => {
      /** @type {{ role: 'user' | 'assistant'; content: string }[]} */
      const msgs = []
      for (const e of entries) {
        if (e.response) {
          msgs.push({ role: 'user', content: e.prompt })
          msgs.push({ role: 'assistant', content: e.response })
        }
      }
      msgs.push({ role: 'user', content: nextUserContent })
      return msgs
    },
    [entries],
  )

  return { entries, appendEntry, clearHistory, buildMessagesForApi }
}
