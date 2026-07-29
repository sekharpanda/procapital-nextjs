const fs = require('fs')
const path = require('path')

const src = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/index.html'
const html = fs.readFileSync(src, 'utf8')
let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
body = body.replace(/src="data:image\/png;base64,[A-Za-z0-9+/=]+"/g, 'src="/logo.png" alt="ProCapital"')

function toJsx(s) {
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  s = s.replace(/\bclass=/g, 'className=')
  s = s.replace(/\bfor=/g, 'htmlFor=')
  s = s.replace(/\snovalidate\b/gi, ' noValidate')
  // SVG attrs
  const map = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
  }
  for (const [k, v] of Object.entries(map)) {
    s = s.split(k + '=').join(v + '=')
  }
  // void tags
  s = s.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*?)?\s*\/?>/gi, (m, tag, attrs = '') => {
    if (/\/>\s*$/.test(m.trim())) return '<' + tag + (attrs || '') + ' />'
    return '<' + tag + (attrs || '') + ' />'
  })
  // style attrs
  s = s.replace(/style="([^"]*)"/g, (_, css) => {
    const obj = css
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const i = p.indexOf(':')
        if (i < 0) return null
        const key = p
          .slice(0, i)
          .trim()
          .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        let val = p.slice(i + 1).trim()
        if (/^-?\d+(\.\d+)?$/.test(val)) return key + ': ' + val
        return key + ': ' + JSON.stringify(val)
      })
      .filter(Boolean)
      .join(', ')
    return 'style={{' + obj + '}}'
  })
  // links to html pages
  s = s.replace(/href="index\.html(#[^"]*)?"/g, (_, h) => 'href="/' + (h || '') + '"')
  s = s.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/$1"')
  // ensure img alt once
  s = s.replace(/alt="ProCapital"\s+alt="([^"]*)"/g, 'alt="$1"')
  return s
}

let jsx = toJsx(body)

// Mark interactive regions with comments for manual swap later
const outPath = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/components/HomeExact.raw.jsx'
fs.writeFileSync(outPath, jsx, 'utf8')
console.log('wrote', outPath, jsx.length)

// Also re-copy exact CSS from original
const style = html.match(/<style>([\s\S]*?)<\/style>/i)[1]
const fonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');\n"
fs.writeFileSync(
  'C:/Users/PROWIN/Desktop/procapital-nextjs/src/css/home.css',
  fonts + style + '\n.svc-link{display:inline-block;margin-top:14px;font-weight:600;color:var(--maroon)}\n',
  'utf8',
)
console.log('css restored', style.length)
