const fs = require('fs')

function writeUtf8(p, content) {
  fs.writeFileSync(p, content.replace(/^\uFEFF/, ''), 'utf8')
}

function fixBom(p) {
  let b = fs.readFileSync(p)
  let t
  if (b.length >= 2 && b[1] === 0 && b[0] !== 0) t = b.toString('utf16le')
  else t = b.toString('utf8')
  t = t.replace(/^\uFEFF/, '')
  fs.writeFileSync(p, t, 'utf8')
  console.log('fixed', p, JSON.stringify(t.slice(0, 24)))
}

for (const p of [
  'src/app/(frontend)/page.tsx',
  'src/app/(frontend)/layout.tsx',
  'src/components/ExactHomeClient.tsx',
]) {
  if (fs.existsSync(p)) fixBom(p)
}

const slugPath = 'src/app/(frontend)/[slug]/page.tsx'
let slug = fs.readFileSync(slugPath, 'utf8').replace(/^\uFEFF/, '')
if (slug.charCodeAt(1) === 0) slug = fs.readFileSync(slugPath).toString('utf16le')
slug = slug.replace(/^\uFEFF/, '')
if (!slug.includes("import '@/css/guide.css'")) {
  slug = "import '@/css/guide.css'\n" + slug
}
fs.writeFileSync(slugPath, slug, 'utf8')
console.log('slug ok')

// Verify page content
const page = fs.readFileSync('src/app/(frontend)/page.tsx', 'utf8')
console.log('page has ExactHome', page.includes('ExactHomeClient'))
console.log('layout has home.css only guide?', fs.readFileSync('src/app/(frontend)/layout.tsx','utf8').includes('guide.css'))
