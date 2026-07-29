const fs = require('fs')
const src = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/index.html'
const buf = fs.readFileSync(src)
// detect encoding
console.log('BOM', buf[0], buf[1], buf[2])
const html = buf.toString('utf8')
console.log('sample arrow', html.includes('?'), html.includes('?'), html.includes('?'))
let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
body = body.replace(/src="data:image\/png;base64,[A-Za-z0-9+/=]+"/g, 'src="/logo.png" alt="ProCapital ? Dubai mortgage advisors"')
body = body.replace(/href="index\.html(#[^"]*)?"/g, (_, h) => 'href="/' + (h || '') + '"')
body = body.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/$1"')
fs.mkdirSync('src/content', { recursive: true })
fs.writeFileSync('src/content/homeExact.html', body, { encoding: 'utf8' })
// verify
const out = fs.readFileSync('src/content/homeExact.html', 'utf8')
console.log('out arrows', out.includes('?'), out.includes('?'), out.includes('?'))
console.log('nav cta snippet:', out.match(/nav-mobile-cta">([^<]+)/)?.[1])
console.log('eyebrow:', out.match(/eyebrow">([^<]+)/)?.[1])

const scripts = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1])
  .filter(s => s.includes('leadForm') || s.includes('getElementById'))
let script = scripts.join('\n\n').replace(/fetch\('leadrat\.php'/g, "fetch('/api/leadrat'")
fs.writeFileSync('src/content/homeExact.js', script, 'utf8')

// restore CSS exactly
const style = html.match(/<style>([\s\S]*?)<\/style>/i)[1]
const fonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');\n"
fs.writeFileSync('src/css/home.css', fonts + style, 'utf8')
console.log('css ok', style.length)
