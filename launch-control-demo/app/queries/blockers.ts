import { defineQueryOptions } from '@pinia/colada'

export const blockersQuery = defineQueryOptions({
  key: ['blockers'],
  query: () => useRequestFetch()('/api/blockers') as Promise<Blocker[]>
})
