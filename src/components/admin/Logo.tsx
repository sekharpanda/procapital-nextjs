import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '-0.02em' }}>
      <span style={{ color: '#0E4D5C' }}>PRO</span>
      <span style={{ color: '#17242A' }}>Capital</span>
      <span style={{ fontWeight: 600, fontSize: 12, opacity: 0.55, marginLeft: 4 }}>CMS</span>
    </div>
  )
}
