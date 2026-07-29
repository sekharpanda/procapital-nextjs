import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const p = await getPayload({ config })
  const pages = await p.find({ collection: 'pages', limit: 1, overrideAccess: true })
  const users = await p.find({ collection: 'users', limit: 1, overrideAccess: true })
  console.log('SMOKE_OK', { pages: pages.totalDocs, users: users.totalDocs, db: process.env.DATABASE_URL?.slice(0, 20) })
  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})
