import { db, schema } from 'hub:db'
import { desc, eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  return db
    .select()
    .from(schema.blockers)
    .where(eq(schema.blockers.userId, user.id))
    .orderBy(desc(schema.blockers.updatedAt), desc(schema.blockers.createdAt))
})
