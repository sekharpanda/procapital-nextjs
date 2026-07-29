const fs = require('fs')
let t = fs.readFileSync('next.config.ts', 'utf8')
if (!t.includes('remotePatterns')) {
  t = t.replace(
    'images: {\n    localPatterns: [',
    `images: {\n    remotePatterns: [\n      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },\n      { protocol: 'https', hostname: '**.vercel-storage.com' },\n    ],\n    localPatterns: [`,
  )
  fs.writeFileSync('next.config.ts', t, 'utf8')
  console.log('next images remotePatterns added')
} else console.log('remotePatterns already present')

// ensure push flag good
let c = fs.readFileSync('src/payload.config.ts', 'utf8')
if (!c.includes('PAYLOAD_DATABASE_PUSH')) {
  c = c.replace(
    /push:\s*process\.env\.NODE_ENV !== 'production',/,
    "push: process.env.PAYLOAD_DATABASE_PUSH !== 'false',",
  )
  fs.writeFileSync('src/payload.config.ts', c, 'utf8')
}
console.log('push line:', (c.match(/push:[^\n]+/) || [])[0])
