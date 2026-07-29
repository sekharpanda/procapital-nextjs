const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/'
const outDir = 'C:/Users/PROWIN/Desktop/procapital-nextjs/src/css'
fs.mkdirSync(outDir, { recursive: true })
const fonts = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');\n"
function styleOf(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8')
  const m = html.match(/<style>([\s\S]*?)<\/style>/i)
  if (!m) throw new Error('no style in ' + file)
  return m[1]
}
fs.writeFileSync(path.join(outDir, 'home.css'), fonts + styleOf('index.html'), 'utf8')
fs.writeFileSync(path.join(outDir, 'guide.css'), fonts + styleOf('equity-release-dubai.html'), 'utf8')
console.log('Wrote CSS', fs.statSync(path.join(outDir,'home.css')).size, fs.statSync(path.join(outDir,'guide.css')).size)
