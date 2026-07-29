const fs = require('fs')
const content = `'use client'

import React from 'react'

/** Always-visible control in the admin header/sidebar to open the public homepage. */
export default function ViewSiteButton() {
  return (
    <a
      className="pc-view-site"
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      title="Open website homepage"
    >
      <span aria-hidden="true">Home</span>
      <span className="pc-view-site__label">View website</span>
    </a>
  )
}
`
fs.writeFileSync('src/components/admin/ViewSiteButton.tsx', content, 'utf8')
console.log('rewrote ViewSiteButton')
