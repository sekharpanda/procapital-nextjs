const fs = require('fs')
let cms = fs.readFileSync('src/lib/cms.ts', 'utf8')
cms = cms.replace(
  `.replace(/<div class="ticker"[\\s\\S]*?<\\/div>\\s*/i, '')`,
  `.replace(/<div class="ticker"[\\s\\S]*?<div class="ticker-track"[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*/i, '')`,
)
fs.writeFileSync('src/lib/cms.ts', cms, 'utf8')

let seed = fs.readFileSync('src/seed/structure.ts', 'utf8')
seed = seed.replace("from '../src/payload.config'", "from '../payload.config'")
fs.writeFileSync('src/seed/structure.ts', seed, 'utf8')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.scripts['seed:structure'] = 'cross-env NODE_OPTIONS=--no-deprecation tsx src/seed/structure.ts'
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
console.log('fixed')
