import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })
  const u = await payload.findByID({ collection: 'users', id: 1, overrideAccess: true, showHiddenFields: true })
  const keys = Object.keys(u)
  console.log('KEYS', keys.join(','))
  console.log('LOCK', JSON.stringify({
    loginAttempts: (u as any).loginAttempts,
    lockUntil: (u as any).lockUntil,
    _verified: (u as any)._verified,
  }))
  // unlock if needed
  await payload.unlock({ collection: 'users', data: { email: 'tech@prowinproperties.com' } }).catch(async (e) => {
    console.log('unlock via API failed', e?.message)
    await payload.update({
      collection: 'users',
      id: 1,
      data: { loginAttempts: 0, lockUntil: null } as any,
      overrideAccess: true,
    }).catch((err) => console.log('manual unlock fail', err?.message))
  })
  console.log('UNLOCKED_OR_CLEARED')
  process.exit(0)
}
run().catch((e)=>{console.error(e); process.exit(1)})
