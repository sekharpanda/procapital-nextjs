const fs = require('fs')

fs.writeFileSync(
  'src/components/admin/ViewSiteButton.tsx',
  `'use client'

import React from 'react'

/** Always-visible control in the admin header to return to the public homepage. */
export default function ViewSiteButton() {
  const href = process.env.NEXT_PUBLIC_SITE_URL || '/'

  return (
    <a
      className="pc-view-site"
      href={href.endsWith('/') ? href : href + '/'}
      target="_blank"
      rel="noopener noreferrer"
      title="Open website homepage"
    >
      <span aria-hidden="true">Home</span>
      <span className="pc-view-site__label">View website</span>
    </a>
  )
}
`,
  'utf8',
)

const cfgPath = 'src/payload.config.ts'
let cfg = fs.readFileSync(cfgPath, 'utf8')
if (!cfg.includes('ViewSiteButton')) {
  cfg = cfg.replace(
    `components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
      beforeDashboard: ['/components/admin/Dashboard'],
    },`,
    `components: {
      actions: ['/components/admin/ViewSiteButton'],
      beforeNavLinks: ['/components/admin/ViewSiteButton'],
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
      beforeDashboard: ['/components/admin/Dashboard'],
    },`,
  )
  fs.writeFileSync(cfgPath, cfg.replace(/\r\n/g, '\n'), 'utf8')
}

const scssPath = 'src/app/(payload)/custom.scss'
let scss = fs.readFileSync(scssPath, 'utf8')
if (!scss.includes('.pc-view-site')) {
  scss += `

/* Always-visible “View website / Home” in admin header + sidebar */
.pc-view-site {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 8px 14px !important;
  border-radius: 999px !important;
  background: linear-gradient(135deg, #0e4d5c, #0a3a46) !important;
  color: #fff !important;
  text-decoration: none !important;
  font-weight: 700 !important;
  font-size: 0.85rem !important;
  line-height: 1 !important;
  white-space: nowrap !important;
  box-shadow: 0 8px 18px -12px rgba(14, 77, 92, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.pc-view-site:hover {
  filter: brightness(1.06);
  color: #fff !important;
  text-decoration: none !important;
}

.nav .pc-view-site {
  margin: 8px 10px 14px !important;
  justify-content: center !important;
  width: calc(100% - 20px) !important;
}

.app-header .pc-view-site,
.template-default__wrap .pc-view-site {
  margin-right: 8px !important;
}
`
  fs.writeFileSync(scssPath, scss.replace(/\r\n/g, '\n'), 'utf8')
}

console.log('done')
