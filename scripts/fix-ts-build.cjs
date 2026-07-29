const fs = require('fs')
const ts = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
const exclude = new Set([...(ts.exclude || []), 'src/seed', 'scripts', 'tests'])
ts.exclude = [...exclude]
fs.writeFileSync('tsconfig.json', JSON.stringify(ts, null, 2))
console.log('exclude', ts.exclude)

// Also cast seed create to avoid if still included
let seed = fs.readFileSync('src/seed/index.ts', 'utf8')
seed = seed.replace(
  'await payload.create({ collection: \'pages\', data })',
  'await payload.create({ collection: \'pages\', data: data as any })',
)
seed = seed.replace(
  'await payload.update({ collection: \'pages\', id: existing.docs[0].id, data })',
  'await payload.update({ collection: \'pages\', id: existing.docs[0].id, data: data as any })',
)
fs.writeFileSync('src/seed/index.ts', seed, 'utf8')
console.log('seed casts applied')
