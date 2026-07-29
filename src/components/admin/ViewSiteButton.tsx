'use client'

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
