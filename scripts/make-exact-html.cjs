const fs = require('fs')
const path = require('path')
const src = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/index.html'
const html = fs.readFileSync(src, 'utf8')
let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]
body = body.replace(/<script[\s\S]*?<\/script>/gi, '')
body = body.replace(/src="data:image\/png;base64,[A-Za-z0-9+/=]+"/g, 'src="/logo.png" alt="ProCapital ? Dubai mortgage advisors"')
body = body.replace(/href="index\.html(#[^"]*)?"/g, (_, h) => 'href="/' + (h || '') + '"')
body = body.replace(/href="([a-z0-9-]+)\.html"/g, 'href="/$1"')
const outDir = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/content'
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'homeExact.html'), body, 'utf8')
console.log('html', body.length)

// Extract original runtime script and patch leadrat URL
const scripts = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(m => m[1])
  .filter(s => s.includes('leadForm') || s.includes('getElementById'))
const script = scripts.join('\n\n').replace(/fetch\('leadrat\.php'/g, "fetch('/api/leadrat'")
fs.writeFileSync(path.join(outDir, 'homeExact.js'), script, 'utf8')
console.log('script', script.length)
