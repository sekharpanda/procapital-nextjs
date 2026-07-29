const fs = require('fs')
const p = 'src/payload.config.ts'
let t = fs.readFileSync(p, 'utf8')
if (!t.includes("'https://procapital.ae'")) {
  t = t.replace(
    "'https://procapital-nextjs.vercel.app',",
    "'https://procapital-nextjs.vercel.app',\n      'https://procapital.ae',\n      'https://www.procapital.ae',"
  )
  fs.writeFileSync(p, t.replace(/\r\n/g, '\n'), 'utf8')
  console.log('added origins')
} else console.log('already present')
