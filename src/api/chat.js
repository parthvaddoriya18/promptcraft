import { openaiModel } from '../config'
import { openaiClient } from './openaiClient'

/**
 * @param {{ role: 'user' | 'assistant' | 'system'; content: string }[]} messages
 * @returns {Promise<string>} Assistant message text
 */
export async function sendChatCompletion(messages) {
  const { data } = await openaiClient.post('/chat/completions', {
    model: openaiModel,
    messages,
  })
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('Empty response from the model.')
  return text
}
