<template>
  <div class="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
    <div class="space-y-4">
      <div class="space-y-2">
        <p class="text-sm font-medium uppercase tracking-wide text-primary">
          Internal product operations
        </p>
        <h2 class="text-3xl font-semibold tracking-tight">
          Keep launch blockers visible before they become launch delays.
        </h2>
        <p class="max-w-2xl text-base text-neutral-600 dark:text-neutral-300">
          Launch Control gives team leads a protected dashboard for triaging open blockers,
          tracking owners, and resolving launch risk in one NuxtHub-backed app.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <UCard>
          <template #header>
            <span class="font-medium">GitHub login</span>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300">
            Sign in with GitHub and keep blocker records scoped to the current user session.
          </p>
        </UCard>
        <UCard>
          <template #header>
            <span class="font-medium">Blocker workflow</span>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300">
            Capture severity, status, owner, due date, and implementation notes for every launch risk.
          </p>
        </UCard>
        <UCard>
          <template #header>
            <span class="font-medium">Operational clarity</span>
          </template>
          <p class="text-sm text-neutral-600 dark:text-neutral-300">
            Use the dashboard to spot overdue items, high-severity blockers, and items ready to resolve.
          </p>
        </UCard>
      </div>
    </div>

    <UCard>
      <template #header>
        <span class="font-medium">What this starter uses</span>
      </template>

      <ul class="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-database" class="mt-0.5 size-4 text-primary" />
          NuxtHub sqlite database for blocker records and filtering.
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-shield-check" class="mt-0.5 size-4 text-primary" />
          `nuxt-auth-utils` GitHub OAuth for protected views.
        </li>
        <li class="flex items-start gap-2">
          <UIcon name="i-lucide-layout-panel-top" class="mt-0.5 size-4 text-primary" />
          Nuxt UI components for an internal-tool shell and forms.
        </li>
      </ul>

      <template #footer>
        <p class="text-sm text-neutral-500">
          No personal GitHub data is stored beyond the user identifier used to associate blocker records.
        </p>
      </template>
    </UCard>
  </div>
</template>
