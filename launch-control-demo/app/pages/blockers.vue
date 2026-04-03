<script setup lang="ts">
import { blockersQuery } from '~/queries/blockers'

definePageMeta({
  middleware: 'auth'
})

const severityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' }
] as const

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' }
] as const

const toast = useToast()
const queryCache = useQueryCache()
const editingId = ref<number | null>(null)

const form = reactive({
  title: '',
  owner: '',
  severity: 'medium' as Blocker['severity'],
  status: 'open' as Blocker['status'],
  dueDate: '',
  notes: ''
})

const { data: blockers } = useQuery(blockersQuery)

function resetForm() {
  editingId.value = null
  form.title = ''
  form.owner = ''
  form.severity = 'medium'
  form.status = 'open'
  form.dueDate = ''
  form.notes = ''
}

function applyBlockerToForm(blocker: Blocker) {
  editingId.value = blocker.id
  form.title = blocker.title
  form.owner = blocker.owner
  form.severity = blocker.severity
  form.status = blocker.status
  form.dueDate = blocker.dueDate ? new Date(blocker.dueDate).toISOString().slice(0, 10) : ''
  form.notes = blocker.notes ?? ''
}

async function refreshBlockers(message?: string) {
  await queryCache.invalidateQueries(blockersQuery)
  if (message) {
    toast.add({ title: message })
  }
}

const { mutate: saveBlocker, isLoading: saving } = useMutation({
  mutation: () => {
    const payload = {
      title: form.title,
      owner: form.owner,
      severity: form.severity,
      status: form.status,
      dueDate: form.dueDate || null,
      notes: form.notes
    }

    if (editingId.value) {
      return $fetch(`/api/blockers/${editingId.value}`, {
        method: 'PATCH',
        body: payload
      })
    }

    return $fetch('/api/blockers', {
      method: 'POST',
      body: payload
    })
  },

  async onSuccess() {
    await refreshBlockers(editingId.value ? 'Blocker updated.' : 'Blocker created.')
    resetForm()
  },

  onError(err) {
    if (isNuxtZodError(err)) {
      const title = err.data?.data.issues.map(issue => issue.message).join('\n')
      if (title) {
        toast.add({ title, color: 'error' })
      }
      return
    }

    console.error(err)
    toast.add({ title: 'Unexpected Error', color: 'error' })
  }
})

const { mutate: setStatus } = useMutation({
  mutation: ({ blocker, status }: { blocker: Blocker, status: Blocker['status'] }) => {
    return $fetch(`/api/blockers/${blocker.id}`, {
      method: 'PATCH',
      body: { status }
    })
  },

  async onSuccess() {
    await refreshBlockers('Status updated.')
  },

  onError(err) {
    console.error(err)
    toast.add({ title: 'Unable to update status.', color: 'error' })
  }
})

const { mutate: deleteBlocker } = useMutation({
  mutation: (blocker: Blocker) => $fetch(`/api/blockers/${blocker.id}`, { method: 'DELETE' }),

  async onSuccess() {
    await refreshBlockers('Blocker deleted.')
    if (editingId.value) {
      resetForm()
    }
  },

  onError(err) {
    console.error(err)
    toast.add({ title: 'Unable to delete blocker.', color: 'error' })
  }
})

function severityColor(severity: Blocker['severity']) {
  if (severity === 'high') return 'error'
  if (severity === 'medium') return 'warning'
  return 'neutral'
}

function statusColor(status: Blocker['status']) {
  if (status === 'resolved') return 'success'
  if (status === 'in_progress') return 'warning'
  return 'error'
}

function formatDate(value: string | Date | null) {
  if (!value) return 'No due date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
    <UCard>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">
            {{ editingId ? 'Edit blocker' : 'Add blocker' }}
          </h2>
          <p class="text-sm text-neutral-500">
            Capture a launch risk with enough context for execution.
          </p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="saveBlocker()">
        <UFormField label="Title" required>
          <UInput v-model="form.title" placeholder="Checkout webhooks failing in staging" />
        </UFormField>

        <UFormField label="Owner" required>
          <UInput v-model="form.owner" placeholder="Alex Kim" />
        </UFormField>

        <div class="grid gap-4 md:grid-cols-2">
          <UFormField label="Severity" required>
            <select
              v-model="form.severity"
              class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option v-for="option in severityOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormField>
          <UFormField label="Status" required>
            <select
              v-model="form.status"
              class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </UFormField>
        </div>

        <UFormField label="Due date">
          <UInput v-model="form.dueDate" type="date" />
        </UFormField>

        <UFormField label="Notes">
          <UTextarea v-model="form.notes" :rows="5" placeholder="Include repro steps, dependencies, or launch context." />
        </UFormField>

        <div class="flex flex-wrap items-center gap-2">
          <UButton type="submit" icon="i-lucide-save" :loading="saving">
            {{ editingId ? 'Save changes' : 'Create blocker' }}
          </UButton>
          <UButton type="button" variant="ghost" color="neutral" icon="i-lucide-rotate-ccw" @click="resetForm">
            Reset
          </UButton>
        </div>
      </form>
    </UCard>

    <UCard>
      <template #header>
        <div>
          <h2 class="text-xl font-semibold">Tracked blockers</h2>
          <p class="text-sm text-neutral-500">Update status inline or reopen an item for editing.</p>
        </div>
      </template>

      <div v-if="blockers?.length" class="space-y-3">
        <div
          v-for="blocker in blockers"
          :key="blocker.id"
          class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-medium">{{ blocker.title }}</p>
                <UBadge :color="severityColor(blocker.severity)" variant="soft">{{ blocker.severity }}</UBadge>
                <UBadge :color="statusColor(blocker.status)" variant="soft">{{ blocker.status.replace('_', ' ') }}</UBadge>
              </div>
              <p class="text-sm text-neutral-500">
                Owner: {{ blocker.owner }} · Due {{ formatDate(blocker.dueDate) }}
              </p>
              <p v-if="blocker.notes" class="text-sm text-neutral-600 dark:text-neutral-300">
                {{ blocker.notes }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UButton size="xs" variant="soft" color="neutral" @click="applyBlockerToForm(blocker)">
                Edit
              </UButton>
              <UButton size="xs" variant="soft" color="warning" @click="setStatus({ blocker, status: 'in_progress' })">
                In progress
              </UButton>
              <UButton size="xs" variant="soft" color="success" @click="setStatus({ blocker, status: 'resolved' })">
                Resolve
              </UButton>
              <UButton size="xs" variant="soft" color="error" @click="deleteBlocker(blocker)">
                Delete
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <p v-else class="text-sm text-neutral-500">
        No blockers yet. Add one from the form to start tracking launch risk.
      </p>
    </UCard>
  </div>
</template>
