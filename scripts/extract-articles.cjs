const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/'
const out = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/seed/content.json'

function bodyOf(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8')
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return m ? m[1] : ''
}
function between(html, startRe, endRe) {
  const s = html.search(startRe)
  if (s < 0) return ''
  const rest = html.slice(s)
  const e = rest.search(endRe)
  return e < 0 ? rest : rest.slice(0, e)
}
function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
}
function articleInner(file) {
  const body = stripScripts(bodyOf(file))
  const m = body.match(/<article[^>]*>\s*<div class="wrap">([\s\S]*?)<\/div>\s*<\/article>/i)
  if (!m) return ''
  // remove related CTA sections at end we render in React
  return m[1]
    .replace(/<div class="cta"[\s\S]*$/i, '')
    .replace(/<div class="related"[\s\S]*$/i, '')
    .replace(/<p class="disclaimer"[\s\S]*$/i, '')
    .trim()
}

const content = {
  equity: articleInner('equity-release-dubai.html'),
  residents: articleInner('mortgage-for-residents-dubai.html'),
  offplan: articleInner('off-plan-mortgage-dubai.html'),
}
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(content, null, 2), 'utf8')
console.log(Object.fromEntries(Object.entries(content).map(([k,v]) => [k, v.length])))
