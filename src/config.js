/** OpenAI API key from `.env` — use `VITE_OPENAI_API_KEY` (required prefix for Vite). */
export const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY ?? ''

/** Chat model (e.g. gpt-4o-mini). Override with `VITE_OPENAI_MODEL`. */
export const openaiModel =
  import.meta.env.VITE_OPENAI_MODEL?.trim() || 'gpt-4o-mini'
