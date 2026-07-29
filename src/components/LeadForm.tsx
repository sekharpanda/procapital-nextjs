'use client'

import { FormEvent, useState } from 'react'

export function LeadForm() {
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null)
  const [sending, setSending] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('lname') as HTMLInputElement).value.trim()
    const cc = (form.elements.namedItem('lcc') as HTMLSelectElement).value
    const phone = (form.elements.namedItem('lphone') as HTMLInputElement).value.replace(/\D/g, '')
    const email = (form.elements.namedItem('lemail') as HTMLInputElement).value.trim()
    const service = (form.elements.namedItem('lservice') as HTMLSelectElement).value

    if (!name || phone.length < 7 || !email || !service) {
      setMsg({
        text: 'Please complete all fields with a valid mobile and email.',
        color: '#b00020',
      })
      return
    }

    setSending(true)
    const now = new Date()
    const pad = (n: number) => (n < 10 ? '0' : '') + n
    const payload = {
      name,
      countryCode: cc,
      mobile: phone,
      email,
      project: 'ProCapital',
      notes: `Mortgage enquiry — service requested: ${service}`,
      source: 'Website',
      subSource: 'ProCapital.ae — callback form',
      submittedDate: `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`,
      submittedTime: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      additionalProperties: { Service: service, PageUrl: window.location.href },
    }

    try {
      const res = await fetch('/api/leadrat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
      const data = await res.json()
      if (data?.ok) {
        setMsg({
          text: '✓ Thank you! A ProCapital advisor will call you shortly.',
          color: '#137333',
        })
        form.reset()
      } else {
        setMsg({ text: 'Received — our team will contact you shortly.', color: '#b06000' })
      }
    } catch {
      setMsg({ text: 'Received — our team will contact you shortly.', color: '#b06000' })
    } finally {
      setSending(false)
    }
  }

  return (
    <form id="leadForm" noValidate onSubmit={onSubmit}>
      <div className="form-row">
        <label htmlFor="lname">Full name</label>
        <input id="lname" name="lname" type="text" placeholder="Your name" required />
      </div>
      <div className="form-row">
        <label htmlFor="lphone">Mobile</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <select id="lcc" name="lcc" defaultValue="+971" style={{ maxWidth: 110 }}>
            <option value="+971">+971</option>
            <option value="+91">+91</option>
            <option value="+44">+44</option>
            <option value="+1">+1</option>
          </select>
          <input id="lphone" name="lphone" type="tel" placeholder="50 123 4567" required />
        </div>
      </div>
      <div className="form-row">
        <label htmlFor="lemail">Email</label>
        <input id="lemail" name="lemail" type="email" placeholder="you@email.com" required />
      </div>
      <div className="form-row">
        <label htmlFor="lservice">I need help with</label>
        <select id="lservice" name="lservice" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option>Resident mortgage</option>
          <option>Non-resident mortgage</option>
          <option>Off-plan / handover finance</option>
          <option>Equity release / refinance</option>
          <option>Commercial finance</option>
          <option>Not sure — advise me</option>
        </select>
      </div>
      <button className="btn btn-primary" type="submit" disabled={sending}>
        {sending ? 'Sending…' : 'Get my free callback'}
      </button>
      {msg && (
        <p className="form-msg" style={{ display: 'block', color: msg.color }}>
          {msg.text}
        </p>
      )}
      <p className="consent">By submitting, you agree to be contacted by ProCapital about your enquiry.</p>
    </form>
  )
}
