import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const blockers = sqliteTable('blockers', {
  id: integer('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: text('title').notNull(),
  owner: text('owner').notNull(),
  severity: text('severity', {
    enum: ['low', 'medium', 'high']
  }).notNull(),
  status: text('status', {
    enum: ['open', 'in_progress', 'resolved']
  }).notNull().default('open'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  notes: text('notes').notNull().default(''),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
