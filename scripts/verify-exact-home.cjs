const fs = require('fs')
const html = fs.readFileSync('src/content/homeExact.html','utf8')
const checks = ['ticker','trustbar','trust-pills','svc-grid','services','how','why','banks','testi','faq','leadForm','calc','fab','Get a free consultation','View mortgage rates','OUR SERVICES','Advice you can actually trust','Buyers who trusted']
for (const c of checks) console.log((html.includes(c)?'OK ':'MISS'), c)
// count svc-card
console.log('svc-cards', (html.match(/svc-card/g)||[]).length)
console.log('trust items', (html.match(/trust-grid/g)||[]).length)
console.log('hero accent', html.includes('class="accent"'))

// fix metadata em dash in page.tsx
let page = fs.readFileSync('src/app/(frontend)/page.tsx','utf8')
page = page.replace(/ProCapital[^"]*ProCapital/g, (m)=>m)
page = page.replace(/Home Loans & Equity Release .+ ProCapital/, 'Home Loans & Equity Release ? ProCapital')
fs.writeFileSync('src/app/(frontend)/page.tsx', page, 'utf8')

// patch homeExact.js leadrat if needed
let js = fs.readFileSync('src/content/homeExact.js','utf8')
console.log('leadrat url', js.includes("/api/leadrat"))
if (!js.includes("/api/leadrat")) {
  js = js.replace(/fetch\('leadrat\.php'/g, "fetch('/api/leadrat'")
  fs.writeFileSync('src/content/homeExact.js', js, 'utf8')
}
