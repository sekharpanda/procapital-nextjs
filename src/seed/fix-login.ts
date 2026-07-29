import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const EMAIL = process.env.SUPERADMIN_EMAIL || 'tech@prowinproperties.com'
const PASS = process.env.SUPERADMIN_PASSWORD
if (!PASS) {
  console.error('Set SUPERADMIN_PASSWORD in the environment (do not hardcode secrets).')
  process.exit(1)
}

async function run() {
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 5,
    overrideAccess: true,
  })

  console.log('COUNT', found.totalDocs)
  for (const u of found.docs) {
    console.log('USER', JSON.stringify({
      id: u.id,
      email: u.email,
      role: u.role,
      approvalStatus: u.approvalStatus,
      collection: 'users',
    }))
  }

  let user = found.docs[0]
  if (!user) {
    user = await payload.create({
      collection: 'users',
      data: {
        email: EMAIL,
        password: PASS,
        name: 'ProWin Super Admin',
        role: 'superadmin',
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
        approvedByEmail: 'system-reset',
      },
      overrideAccess: true,
    })
    console.log('CREATED', user.id)
  } else {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: PASS,
        role: 'superadmin',
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
        approvedByEmail: 'system-reset',
        name: 'ProWin Super Admin',
      },
      overrideAccess: true,
    })
    console.log('UPDATED', user.id)
  }

  // verify readback
  const again = await payload.findByID({ collection: 'users', id: user.id, overrideAccess: true })
  console.log('AFTER', JSON.stringify({
    id: again.id,
    email: again.email,
    role: again.role,
    approvalStatus: again.approvalStatus,
  }))

  try {
    const login = await payload.login({
      collection: 'users',
      data: { email: EMAIL, password: PASS },
    })
    console.log('LOGIN_OK', Boolean(login?.token), login?.user?.approvalStatus, login?.user?.role)
  } catch (e: any) {
    console.log('LOGIN_FAIL', e?.message || String(e))
    // dump beforeLogin related fields
  }

  // Also try HTTP login against running server
  try {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASS }),
    })
    const body = await res.text()
    console.log('HTTP_LOGIN', res.status, body.slice(0, 300))
  } catch (e: any) {
    console.log('HTTP_LOGIN_ERR', e?.message || String(e))
  }

  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
