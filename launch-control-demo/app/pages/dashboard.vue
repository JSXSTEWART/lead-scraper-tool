<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { data: stats } = await useFetch('/api/blockers/stats')
const { data: blockers } = await useFetch('/api/blockers')

const overdueCount = computed(() => {
  return (blockers.value || []).filter((blocker) => {
    if (!blocker.dueDate || blocker.status === 'resolved') {
      return false
    }

    return new Date(blocker.dueDate).getTime() < Date.now()
  }).length
})

const nextDueBlockers = computed(() => {
  return [...(blockers.value || [])]
    .filter(blocker => blocker.dueDate && blocker.status !== 'resolved')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5)
})

function statusColor(status: Blocker['status']) {
  if (status === 'resolved') return 'success'
  if (status === 'in_progress') return 'warning'
  return 'error'
}

function severityColor(severity: Blocker['severity']) {
  if (severity === 'high') return 'error'
  if (severity === 'medium') return 'warning'
  return 'neutral'
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
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight">
        Dashboard
      </h2>
      <p class="text-sm text-neutral-500">
        A fast snapshot of launch risk for the current signed-in user.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <UCard>
        <p class="text-sm text-neutral-500">Total blockers</p>
        <p class="text-3xl font-semibold">{{ stats?.total ?? 0 }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-neutral-500">Open</p>
        <p class="text-3xl font-semibold">{{ stats?.open ?? 0 }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-neutral-500">In progress</p>
        <p class="text-3xl font-semibold">{{ stats?.inProgress ?? 0 }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-neutral-500">High severity</p>
        <p class="text-3xl font-semibold">{{ stats?.highSeverity ?? 0 }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-neutral-500">Overdue</p>
        <p class="text-3xl font-semibold">{{ overdueCount }}</p>
      </UCard>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
      <UCard>
        <template #header>
          <div>
            <h3 class="font-medium">Upcoming due dates</h3>
            <p class="text-sm text-neutral-500">The next blockers that need attention.</p>
          </div>
        </template>

        <div v-if="nextDueBlockers.length" class="space-y-3">
          <div
            v-for="blocker in nextDueBlockers"
            :key="blocker.id"
            class="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium">{{ blocker.title }}</p>
              <UBadge :color="severityColor(blocker.severity)" variant="soft">{{ blocker.severity }}</UBadge>
              <UBadge :color="statusColor(blocker.status)" variant="soft">{{ blocker.status.replace('_', ' ') }}</UBadge>
            </div>
            <p class="mt-2 text-sm text-neutral-500">
              Owner: {{ blocker.owner }} · Due {{ formatDate(blocker.dueDate) }}
            </p>
            <p v-if="blocker.notes" class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {{ blocker.notes }}
            </p>
          </div>
        </div>
        <p v-else class="text-sm text-neutral-500">
          No pending blockers with due dates yet.
        </p>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-medium">Resolve path</h3>
        </template>

        <div class="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
          <div>
            <p class="font-medium text-neutral-900 dark:text-neutral-100">Triage</p>
            <p>Capture the blocker, assign an owner, and set severity.</p>
          </div>
          <div>
            <p class="font-medium text-neutral-900 dark:text-neutral-100">Drive</p>
            <p>Move active work into <span class="font-medium">in progress</span> with clear notes.</p>
          </div>
          <div>
            <p class="font-medium text-neutral-900 dark:text-neutral-100">Close</p>
            <p>Mark the blocker resolved once the launch path is clear.</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
