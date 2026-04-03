import { db, schema } from 'hub:db'
import { eq, sql } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const rows = await db.select({
    total: sql<number>`count(*)`,
    open: sql<number>`sum(case when ${schema.blockers.status} = 'open' then 1 else 0 end)`,
    inProgress: sql<number>`sum(case when ${schema.blockers.status} = 'in_progress' then 1 else 0 end)`,
    resolved: sql<number>`sum(case when ${schema.blockers.status} = 'resolved' then 1 else 0 end)`,
    highSeverity: sql<number>`sum(case when ${schema.blockers.severity} = 'high' then 1 else 0 end)`
  }).from(schema.blockers).where(eq(schema.blockers.userId, user.id))

  return rows[0] || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    highSeverity: 0
  }
})
