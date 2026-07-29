const fs = require('fs')
// Clean Users.ts - remove empty components
let u = fs.readFileSync('src/collections/Users.ts', 'utf8')
u = u.replace(/\n\s*components: \{\},/g, '')
// Add afterChange to stamp approval metadata
if (!u.includes('afterChange')) {
  u = u.replace(
    'hooks: {',
    `hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        if (
          operation === 'update' &&
          doc.approvalStatus === 'approved' &&
          previousDoc?.approvalStatus !== 'approved' &&
          req.user
        ) {
          await req.payload.update({
            collection: 'users',
            id: doc.id,
            data: {
              approvedAt: new Date().toISOString(),
              approvedBy: req.user.id,
            },
            overrideAccess: true,
          })
        }
        return doc
      },
    ],`,
  )
}
fs.writeFileSync('src/collections/Users.ts', u, 'utf8')

// Broaden admin checks to include superadmin across collections/globals
const files = [
  'src/collections/Pages.ts',
  'src/collections/Menus.ts',
  'src/collections/Media.ts',
  'src/globals/Header.ts',
  'src/globals/Footer.ts',
  'src/globals/SiteSettings.ts',
]
for (const f of files) {
  if (!fs.existsSync(f)) continue
  let t = fs.readFileSync(f, 'utf8')
  const before = t
  t = t.replace(/user\?\.role === 'admin'/g, "(user?.role === 'admin' || user?.role === 'superadmin')")
  t = t.replace(/\(user as \{ role\?: string \} \| null\)\?\.role === 'admin'/g, "((user as { role?: string } | null)?.role === 'admin' || (user as { role?: string } | null)?.role === 'superadmin')")
  if (t !== before) {
    fs.writeFileSync(f, t, 'utf8')
    console.log('updated access', f)
  }
}
console.log('patched')
