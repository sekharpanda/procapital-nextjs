const fs = require('fs')
const p = 'src/app/(payload)/custom.scss'
let css = fs.readFileSync(p, 'utf8')

const fix = `
/* ---------------------------------------------------------
   Fix: Payload nav collapse arrow was overlapping sidebar
   labels (Content / Site structure) and blocking clicks.
   Hide it on desktop; keep the mobile header toggler.
   --------------------------------------------------------- */
@media (min-width: 769px) {
  .nav-toggler:not(.app-header__mobile-nav-toggler) {
    display: none !important;
  }
}

/* Extra safety ? if the arrow still renders inside/near the nav,
   push it out of the way and below the menu labels */
.nav .nav-toggler,
.nav > .nav-toggler,
.template-default .nav-toggler.nav-toggler--is-open:not(.app-header__mobile-nav-toggler) {
  display: none !important;
}

/* Give nav groups clear clickable room at the top */
.nav__scroll {
  padding-top: 18px !important;
  position: relative;
  z-index: 2;
}

.nav-group,
.nav__link,
.nav .nav-group__toggle {
  position: relative;
  z-index: 3;
  pointer-events: auto !important;
}
`

if (!css.includes('Fix: Payload nav collapse arrow')) {
  css += '\n' + fix + '\n'
  fs.writeFileSync(p, css, 'utf8')
  console.log('patch added')
} else {
  console.log('already patched')
}
