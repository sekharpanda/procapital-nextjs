'use client'

import { useState } from 'react'

type Faq = { question: string; answer: string; id?: string | null }

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq-list">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div className={`faq-item${isOpen ? ' open' : ''}`} key={faq.id || i}>
            <button
              className="faq-q"
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <span className="ic">+</span>
            </button>
            <div className="faq-a" style={{ maxHeight: isOpen ? 400 : 0 }}>
              <p>{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
