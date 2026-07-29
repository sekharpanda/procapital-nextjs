const fs = require('fs')
const path = require('path')

const root = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/'
const outDir = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/content'
const cssDir = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/css'
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(cssDir, { recursive: true })

const fonts =
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');\n"

const pages = [
  { file: 'equity-release-dubai.html', slug: 'equity-release-dubai' },
  { file: 'mortgage-for-residents-dubai.html', slug: 'mortgage-for-residents-dubai' },
  { file: 'off-plan-mortgage-dubai.html', slug: 'off-plan-mortgage-dubai' },
]

function cleanBody(html) {
  let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
  body = body.replace(/href="index\.html(#[^"]*)?"/g, (_, h) => 'href="/' + (h || '') + '"')
  body = body.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/$1"')
  return body
}

function extractScript(html) {
  const scripts = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m) => m[1])
    .filter((s) => /faq|addEventListener|querySelector/i.test(s))
  return scripts.join('\n\n')
}

// Use equity CSS as shared guide.css (same design tokens across pillars)
const equityHtml = fs.readFileSync(path.join(root, 'equity-release-dubai.html'), 'utf8')
const style = equityHtml.match(/<style>([\s\S]*?)<\/style>/i)[1]
fs.writeFileSync(path.join(cssDir, 'guide.css'), fonts + style, 'utf8')
console.log('guide.css', style.length)

for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p.file), 'utf8')
  const body = cleanBody(html)
  const script = extractScript(html)
  fs.writeFileSync(path.join(outDir, p.slug + '.html'), body, 'utf8')
  fs.writeFileSync(path.join(outDir, p.slug + '.js'), script || '', 'utf8')
  console.log(p.slug, 'html', body.length, 'js', script.length, 'arrows', body.includes('?'))
}

// Manifest of slugs
fs.writeFileSync(
  path.join(outDir, 'guide-pages.json'),
  JSON.stringify(
    pages.map((p) => p.slug),
    null,
    2,
  ),
  'utf8',
)
console.log('done')
