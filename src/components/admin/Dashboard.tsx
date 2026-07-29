'use client'

import React from 'react'

export default function Dashboard() {
  return (
    <div className="procapital-dash">
      <h1>ProCapital control center</h1>
      <p>
        Edit pages with WordPress-style section blocks (Hero, Image, Services, FAQ…). Upload images
        in Media, place them in blocks, Save — the live site updates.
      </p>
      <div className="procapital-dash__meta">
        <span>Secure team access</span>
        <span>Super Admin approvals</span>
        <span>Header / Footer / Menus</span>
      </div>
      <div className="procapital-dash__grid">
        <a className="card" href="/admin/collections/pages">
          <strong>Pages & sections</strong>
          <span>WordPress-style blocks: text, images, reorder</span>
        </a>
        <a className="card" href="/admin/collections/menus">
          <strong>Menus</strong>
          <span>Header, footer and dropdown links</span>
        </a>
        <a className="card" href="/admin/globals/header">
          <strong>Header design</strong>
          <span>Logo, CTA, layout style, ticker</span>
        </a>
        <a className="card" href="/admin/globals/footer">
          <strong>Footer design</strong>
          <span>Columns, social, disclaimers</span>
        </a>
        <a className="card" href="/admin/collections/media">
          <strong>Media</strong>
          <span>Logos and images</span>
        </a>
        <a className="card" href="/admin/globals/site-settings">
          <strong>General settings</strong>
          <span>Phone, email, brand colors</span>
        </a>
        <a className="card" href="/admin/collections/users">
          <strong>Team users</strong>
          <span>Approve pending accounts</span>
        </a>
        <a className="card" href="/" target="_blank" rel="noreferrer">
          <strong>View website</strong>
          <span>Open the live public site</span>
        </a>
      </div>
    </div>
  )
}
