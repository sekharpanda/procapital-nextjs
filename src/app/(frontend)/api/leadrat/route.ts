import { NextRequest, NextResponse } from 'next/server'

const LEADRAT_URL = 'https://connect.leadrat.com/api/v1/integration/Website'

export async function POST(req: NextRequest) {
  const apiKey = process.env.LEADRAT_API_KEY
  const backupUrl = process.env.LEADRAT_BACKUP_URL || ''

  let data: Record<string, unknown>
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ error: 'No data received' }, { status: 400 })
  }

  if (typeof data.countryCode === 'string') {
    data.countryCode = data.countryCode.replace(/^\+/, '')
  }
  if (typeof data.mobile === 'string') {
    data.mobile = data.mobile.replace(/\D+/g, '')
  }

  const result: Record<string, unknown> = { leadrat: false, backup: false }

  if (apiKey && apiKey !== 'PASTE_YOUR_PROCAPITAL_LEADRAT_API_KEY_HERE') {
    try {
      const res = await fetch(LEADRAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': apiKey,
        },
        body: JSON.stringify([data]),
      })
      const body = await res.text()
      result.leadrat = res.ok
      result.leadrat_status = res.status
      result.leadrat_body = body.slice(0, 500)
    } catch (err) {
      result.leadrat_error = err instanceof Error ? err.message : 'request failed'
    }
  } else {
    result.leadrat_status = 0
    result.leadrat_body = 'LEADRAT_API_KEY not configured'
  }

  if (backupUrl) {
    try {
      const res = await fetch(backupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        redirect: 'follow',
      })
      result.backup = res.ok
    } catch {
      result.backup = false
    }
  }

  result.ok = Boolean(result.leadrat || result.backup)
  return NextResponse.json(result)
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
