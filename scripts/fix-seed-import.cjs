const fs = require('fs')
const p = 'src/seed/index.ts'
let t = fs.readFileSync(p, 'utf8')
t = t.replace("from '../src/payload.config'", "from '../payload.config'")
fs.writeFileSync(p, t)
console.log('fixed', t.includes("from '../payload.config'"))
