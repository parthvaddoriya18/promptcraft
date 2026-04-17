/**
 * Quick check: .env must define VITE_OPENAI_API_KEY.
 * Run: node --env-file=.env scripts/verify-openai.mjs
 */
import https from 'node:https'

const key = process.env.VITE_OPENAI_API_KEY?.trim()

if (!key) {
  console.error('FAIL: VITE_OPENAI_API_KEY is missing or empty in .env')
  process.exit(1)
}

const { statusCode, body } = await new Promise((resolve, reject) => {
  const req = https.request(
    'https://api.openai.com/v1/models',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    },
    (res) => {
      const chunks = []
      res.on('data', (c) => chunks.push(c))
      res.on('end', () =>
        resolve({
          statusCode: res.statusCode,
          body: Buffer.concat(chunks).toString('utf8'),
        }),
      )
    },
  )
  req.on('error', reject)
  req.end()
})

if (statusCode === 200) {
  console.log('OK: OpenAI accepted your API key (HTTP', statusCode + ').')
  process.exit(0)
}

console.error('FAIL: OpenAI returned HTTP', statusCode)
if (body) console.error(body.slice(0, 400))
process.exit(1)
