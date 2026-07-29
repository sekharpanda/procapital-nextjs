'use client'

import { useEffect, useRef } from 'react'

type Props = { html: string; script?: string }

export default function ExactPageClient({ html, script = '' }: Props) {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current || !script.trim()) return
    ran.current = true
    try {
      // eslint-disable-next-line no-new-func
      const run = new Function(script)
      run()
    } catch (err) {
      console.error('Page interactions failed', err)
    }
  }, [script])

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
