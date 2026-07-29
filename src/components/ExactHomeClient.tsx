'use client'

import { useEffect, useRef } from 'react'

type Props = { html: string; script: string }

export default function ExactHomeClient({ html, script }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    try {
      // eslint-disable-next-line no-new-func
      const run = new Function(script)
      run()
    } catch (err) {
      console.error('Home interactions failed', err)
    }
  }, [script])

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
}
