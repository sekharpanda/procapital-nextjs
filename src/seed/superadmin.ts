import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMAIL = 'tech@prowinproperties.com'

async function run() {
  const payload = await getPayload({ config })
  const passwordPath = path.join(__dirname, '../.superadmin-temp-password.txt')
  const password = fs.readFileSync(passwordPath, 'utf8').trim()

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        role: 'superadmin',
        approvalStatus: 'approved',
        name: 'ProWin Super Admin',
        approvedAt: new Date().toISOString(),
      },
    })
    // Reset password via local API
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { password },
    })
    console.log('Updated existing Super Admin:', EMAIL)
  } else {
    await payload.create({
      collection: 'users',
      data: {
        email: EMAIL,
        password,
        name: 'ProWin Super Admin',
        role: 'superadmin',
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
      },
    })
    console.log('Created Super Admin:', EMAIL)
  }

  // Downgrade any other accidental superadmins if needed ? skip
  // Mark any approved-less users pending (safety)
  const all = await payload.find({ collection: 'users', limit: 200 })
  for (const u of all.docs) {
    if (u.email === EMAIL) continue
    if (!u.approvalStatus) {
      await payload.update({
        collection: 'users',
        id: u.id,
        data: { approvalStatus: 'pending' },
      })
    }
  }

  console.log('SUPERADMIN_EMAIL=' + EMAIL)
  console.log('SUPERADMIN_TEMP_PASSWORD=' + password)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
