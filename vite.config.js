import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Proxy avoids browser CORS when calling OpenAI from the dev/preview server.
const openAiProxy = {
  '/api/openai': {
    target: 'https://api.openai.com/v1',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api\/openai/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: openAiProxy,
  },
  preview: {
    proxy: openAiProxy,
  },
})
