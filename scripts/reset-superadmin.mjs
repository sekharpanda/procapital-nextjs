import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

async function run() {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: 'tech@prowinproperties.com' } },
    limit: 1,
    overrideAccess: true,
  })
  const u = found.docs[0]
  if (!u) {
    console.log('USER_MISSING')
    process.exit(1)
  }
  console.log('FOUND', {
    id: u.id,
    email: u.email,
    role: u.role,
    approvalStatus: u.approvalStatus,
    name: u.name,
  })

  const newPass = 'ProCapital@2026!'
  await payload.update({
    collection: 'users',
    id: u.id,
    data: {
      password: newPass,
      role: 'superadmin',
      approvalStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedByEmail: 'system-reset',
      name: u.name || 'ProWin Super Admin',
    },
    overrideAccess: true,
  })
  console.log('PASSWORD_RESET_OK')
  console.log('EMAIL=tech@prowinproperties.com')
  console.log('PASSWORD=' + newPass)

  // Try login via Local API
  try {
    const result = await payload.login({
      collection: 'users',
      data: { email: 'tech@prowinproperties.com', password: newPass },
    })
    console.log('LOGIN_TEST_OK', Boolean(result?.token), 'userRole=', result?.user?.role)
  } catch (e) {
    console.log('LOGIN_TEST_FAIL', e?.message || e)
  }
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
