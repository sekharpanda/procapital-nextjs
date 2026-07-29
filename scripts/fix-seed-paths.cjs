const fs = require('fs')
const p = 'src/seed/index.ts'
let t = fs.readFileSync(p, 'utf8')
t = t.replace("path.join(__dirname, '../src/seed/content.json')", "path.join(__dirname, 'content.json')")
t = t.replace("path.resolve(__dirname, '../public/logo.png')", "path.resolve(__dirname, '../../public/logo.png')")
fs.writeFileSync(p, t)
console.log('paths fixed')
