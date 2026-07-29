const fs = require('fs')
let u = fs.readFileSync('src/collections/Users.ts', 'utf8')
u = u.replace(
  /{\s*name: 'approvedBy',[\s\S]*?},/,
  `{
      name: 'approvedByEmail',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (_: unknown, sibling: { approvalStatus?: string }) => sibling?.approvalStatus === 'approved',
      },
    },`,
)
u = u.replace(
  'approvedBy: req.user.id,',
  'approvedByEmail: (req.user as { email?: string }).email || \"\",',
)
fs.writeFileSync('src/collections/Users.ts', u, 'utf8')
console.log('users simplified')
