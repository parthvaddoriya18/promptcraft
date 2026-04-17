import axios from 'axios'
import { openaiApiKey } from '../config'

/**
 * Base URL for OpenAI HTTP API (`/v1/...`).
 * Default `/api/openai` is proxied by Vite (dev + preview) so the browser avoids CORS.
 * For a static deploy without this proxy, set `VITE_OPENAI_BASE_URL` to your backend URL at build time.
 */
function defaultBaseURL() {
  return import.meta.env.VITE_OPENAI_BASE_URL?.trim() || '/api/openai'
}

export const openaiClient = axios.create({
  baseURL: defaultBaseURL(),
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
    ...(openaiApiKey?.trim() && {
      Authorization: `Bearer ${openaiApiKey.trim()}`,
    }),
  },
})

openaiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      'Request failed'
    const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg))
    err.cause = error
    return Promise.reject(err)
  },
)

/** GET /v1/models — smoke test for auth + axios + proxy. */
export async function listModels() {
  const { data } = await openaiClient.get('/models')
  return data
}
