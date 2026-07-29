const fs = require('fs')
const p = 'src/content/homeExact.js'
let js = fs.readFileSync(p, 'utf8')
// Guard year setter and other getElementById usages if missing
js = js.replace(
  /document\.getElementById\('yr'\)\.textContent=new Date\(\)\.getFullYear\(\);/,
  "var __yr=document.getElementById('yr'); if(__yr) __yr.textContent=new Date().getFullYear();"
)
// Also wrap hdr early use
if (!js.includes('if(!hdr) return;') && js.includes("var hdr=document.getElementById('hdr');")) {
  js = js.replace(
    "var hdr=document.getElementById('hdr');\naddEventListener('scroll',function(){hdr.classList.toggle('scrolled',scrollY>20)});",
    "var hdr=document.getElementById('hdr');\nif(hdr){addEventListener('scroll',function(){hdr.classList.toggle('scrolled',scrollY>20)});}"
  )
}
// burger may be CMS now - guard
js = js.replace(
  "var burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');\nburger.addEventListener('click',function(){navLinks.classList.toggle('open')});\nnavLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navLinks.classList.remove('open')})});",
  "var burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');\nif(burger&&navLinks){burger.addEventListener('click',function(){navLinks.classList.toggle('open')});navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){navLinks.classList.remove('open')})});}"
)
fs.writeFileSync(p, js, 'utf8')
console.log('script guards added', js.includes('if(__yr)'))
