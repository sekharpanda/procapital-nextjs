'use client'

import { useEffect, useRef } from 'react'

type Props = { html: string; script: string }

export default function ExactHomeClient({ html, script }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let cancelled = false
    let attempts = 0

    const bind = () => {
      if (cancelled) return
      if (root.dataset.pcBound === '1') return
      if (!root.querySelector('#priceInput') || !root.querySelector('#price')) {
        if (attempts++ < 40) requestAnimationFrame(bind)
        return
      }
      root.dataset.pcBound = '1'
      try {
        // eslint-disable-next-line no-new-func
        const run = new Function(script)
        run()
      } catch (err) {
        console.error('Home interactions failed', err)
        delete root.dataset.pcBound
      }
    }

    bind()
    return () => {
      cancelled = true
    }
  }, [script, html])

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
}
