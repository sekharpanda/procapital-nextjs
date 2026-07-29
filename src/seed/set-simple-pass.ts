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
  await payload.update({
    collection: 'users',
    id: 1,
    data: {
      password: PASS,
      role: 'superadmin',
      approvalStatus: 'approved',
      loginAttempts: 0,
      lockUntil: null,
    } as any,
    overrideAccess: true,
  })
  const login = await payload.login({ collection: 'users', data: { email: EMAIL, password: PASS } })
  console.log('READY', Boolean(login?.token))
  console.log('EMAIL=' + EMAIL)
  console.log('PASSWORD=' + PASS)
  process.exit(0)
}
run().catch((e)=>{console.error(e); process.exit(1)})
