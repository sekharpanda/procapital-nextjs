const fs = require('fs')
const root = 'C:/Users/PROWIN/Downloads/procapital-website-deploy (1)/'
const off = fs.readFileSync(root + 'off-plan-mortgage-dubai.html', 'utf8')
const style = off.match(/<style>([\s\S]*?)<\/style>/i)[1]
const m = style.match(/\.devs\{[\s\S]*?\}\s*\.devs \.chip\{[\s\S]*?\}/)
const extras = m ? m[0] : null
console.log('extras found', !!extras)
let guide = fs.readFileSync('src/css/guide.css', 'utf8')
if (extras && !guide.includes('.devs{')) {
  guide += '\n' + extras + '\n'
  fs.writeFileSync('src/css/guide.css', guide, 'utf8')
  console.log('appended devs/chip')
} else {
  // try looser extract
  const i = style.indexOf('.devs{')
  if (i >= 0) {
    const chunk = style.slice(i, style.indexOf('}', style.indexOf('}', i) + 1) + 1)
    // get both rules manually
    const re = /\.devs\{[^}]+\}|\.devs \.chip\{[^}]+\}/g
    const rules = style.match(re)
    console.log('rules', rules)
    if (rules && !guide.includes('.devs{')) {
      fs.writeFileSync('src/css/guide.css', guide + '\n' + rules.join('\n') + '\n', 'utf8')
      console.log('appended via match')
    }
  }
}
