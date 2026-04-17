# PromptCraft

Lightweight **React** app: enter a prompt, send it to the **OpenAI Chat Completions** API, and read the reply. Includes **loading** and **error** states, plus **saved chat history** in the browser and a **Clear** button.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (includes `npm`)
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

1. Clone the repository and open the project folder.

   ```bash
   git clone <your-repo-url>
   cd PromptCraft
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Environment variables.

   ```bash
   copy .env.example .env
   ```

   On macOS/Linux use `cp .env.example .env`.

4. Edit `.env` and set your key:

   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```

   Optional:

   ```env
   VITE_OPENAI_MODEL=gpt-4o-mini
   VITE_OPENAI_BASE_URL=
   ```

   If you deploy without the Vite dev proxy, set `VITE_OPENAI_BASE_URL` to a **server you control** that forwards to OpenAI (browser calls to `api.openai.com` are blocked by CORS).

5. Start the dev server.

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Dev server + hot reload  |
| `npm run build`   | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint`    | ESLint                   |

## Submission (assessment)

1. Create a **public GitHub repository** and push this project.
2. Keep this **README** for reviewers.
3. **Do not commit** `.env` or real API keys (they are gitignored).

## Stack

- React 19, Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Axios (OpenAI HTTP client)

## Security note

`VITE_*` variables are embedded in the client bundle. This setup is intended for **local development** and demos. For production, keep API keys on a **backend** and call your own API from the app.
