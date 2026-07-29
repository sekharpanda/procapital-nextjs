const fs = require('fs')
const p = 'src/components/cms/CmsHeader.tsx'
let t = fs.readFileSync(p, 'utf8')
t = t.replace(/\{item\.label\} <span aria-hidden>.*?<\/span>/, "{item.label} <span aria-hidden=\"true\">v</span>")
// also replace any weird char version
t = t.replace(/<span aria-hidden[^>]*>[^<]*<\/span>/, '<span aria-hidden="true">v</span>')
fs.writeFileSync(p, t, 'utf8')
console.log('arrow fixed', t.includes('>v</span>'))
