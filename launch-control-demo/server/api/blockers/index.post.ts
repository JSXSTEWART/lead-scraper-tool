import { z } from 'zod'
import { db, schema } from 'hub:db'

const severityValues = ['low', 'medium', 'high'] as const
const statusValues = ['open', 'in_progress', 'resolved'] as const

const BodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  owner: z.string().trim().min(1).max(80),
  severity: z.enum(severityValues),
  status: z.enum(statusValues),
  dueDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.null()]),
  notes: z.string().trim().max(1000).default('')
})

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, value => BodySchema.parse(value))
  const { user } = await requireUserSession(event)

  const blockers = await db.insert(schema.blockers).values({
    userId: user.id,
    title: body.title,
    owner: body.owner,
    severity: body.severity,
    status: body.status,
    dueDate: body.dueDate ? new Date(body.dueDate) : null,
    notes: body.notes,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning()

  return blockers[0]
})
