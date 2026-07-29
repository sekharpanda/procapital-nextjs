const fs = require('fs')
const root = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/'
function style(file) {
  return fs.readFileSync(root + file, 'utf8').match(/<style>([\s\S]*?)<\/style>/i)[1]
}
const a = style('equity-release-dubai.html')
const b = style('off-plan-mortgage-dubai.html')
const c = style('mortgage-for-residents-dubai.html')
console.log('lens', a.length, b.length, c.length)
// Find selectors unique to offplan
const re = /\.([a-zA-Z][\w-]*)\s*\{/g
function sels(css){ const s=new Set(); let m; while((m=re.exec(css))) s.add(m[1]); return s }
const sa = sels(a), sb = sels(b)
for (const x of sb) if (!sa.has(x)) console.log('offplan-only', x)
