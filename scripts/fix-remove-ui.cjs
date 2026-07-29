const fs = require('fs')

const scssPath = 'src/app/(payload)/custom.scss'
let scss = fs.readFileSync(scssPath, 'utf8')

scss = scss.replace(
  /overflow: hidden;\r?\n\}\r?\n\r?\n\.array-field__row \.collapsible__toggle-wrap/,
  'overflow: visible !important;\n}\n\n.array-field__row .collapsible__toggle-wrap'
)

if (!scss.includes('Make Remove obvious')) {
  scss += `

/* ---------------------------------------------------------
   Make Remove obvious on sections & items (three-dots menu)
   --------------------------------------------------------- */
.array-actions {
  position: relative !important;
  z-index: 30 !important;
  margin-left: auto !important;
}

.array-actions__button {
  width: 36px !important;
  height: 36px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: 1px solid #d9d2c3 !important;
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(14, 45, 55, 0.08) !important;
}

.array-actions__button:hover {
  border-color: var(--pc-teal) !important;
  background: #f4faf7 !important;
}

.popup--active,
.popup__content {
  z-index: 80 !important;
  overflow: visible !important;
}

.array-actions__actions {
  min-width: 180px !important;
  padding: 6px !important;
}

.array-actions__action {
  width: 100% !important;
  padding: 10px 12px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
}

.array-actions__remove {
  color: #b42318 !important;
  background: #fff5f4 !important;
  font-weight: 750 !important;
}

.array-actions__remove:hover {
  background: #fee4e2 !important;
  color: #912018 !important;
}

.blocks-field__block-header,
.array-field__row .collapsible__header,
.collapsible__header,
.collapsible {
  overflow: visible !important;
}
`
}

fs.writeFileSync(scssPath, scss.replace(/\r\n/g, '\n'), 'utf8')

const pagesPath = 'src/collections/Pages.ts'
let pages = fs.readFileSync(pagesPath, 'utf8')
const nextDesc =
  "Add: click \\\"+ Add Section\\\". Edit text/images inside. Remove: click the three-dots (⋮) on the right of a section → Remove, then Save."

if (pages.includes('Click "+ Add Section"') || pages.includes("Click \\\"+ Add Section\\\"")) {
  pages = pages.replace(
    /description:\s*\n\s*'[^']*Add Section[^']*'/,
    `description:\n                  '${nextDesc.replace(/\\"/g, '"').replace(/\\\\/g, '\\')}'`
  )
}

// Safer explicit replace of known string fragments
pages = pages.replace(
  /'Click "\+ Add Section" at the bottom to add Hero, Image, Services, FAQ, Form, etc\. Open a section to edit text and Change image\.'/,
  "'Add: click \"+ Add Section\". Edit text/images inside. Remove: click the three-dots menu on the right of a section → Remove, then Save.'"
)

if (!pages.includes('Remove: click')) {
  pages = pages.replace(
    /(admin: \{\s*initCollapsed: false,\s*description:\s*)'[^']*'/,
    `$1'Add: \"+ Add Section\". Remove: three-dots menu on the section → Remove, then Save.'`
  )
}

fs.writeFileSync(pagesPath, pages.replace(/\r\n/g, '\n'), 'utf8')
console.log('ok', {
  scssHasRemove: scss.includes('Make Remove obvious'),
  pagesHasRemove: pages.includes('Remove'),
})
