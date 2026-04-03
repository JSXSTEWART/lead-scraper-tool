<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'

const { loggedIn, user, clear } = useUserSession()
const colorMode = useColorMode()

watch(loggedIn, () => {
  if (!loggedIn.value) {
    navigateTo('/')
  }
})

const isDarkMode = computed({
  get: () => colorMode.preference === 'dark',
  set: () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'icon', href: '/icon.png' }]
})

useSeoMeta({
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  title: 'Launch Control',
  description: 'Track launch blockers with GitHub auth, Nuxt UI, and a NuxtHub sqlite database.',
  ogImage: '/social-image.png',
  twitterImage: '/social-image.png',
  twitterCard: 'summary_large_image'
})

const items = [
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: clear
    }
  ]
] satisfies DropdownMenuItem[][]
</script>

<template>
  <UApp>
    <UContainer class="my-4 flex min-h-screen flex-col gap-4">
      <div class="flex items-center justify-end">
        <UButton
          square
          variant="ghost"
          color="neutral"
          :icon="
            $colorMode.preference === 'dark' || $colorMode.preference === 'system'
              ? 'i-lucide-moon'
              : 'i-lucide-sun'
          "
          @click="isDarkMode = !isDarkMode"
        />
      </div>

      <UCard variant="subtle">
        <template #header>
          <div>
            <h1 class="text-xl font-semibold leading-6">
              <NuxtLink to="/">
                Launch Control
              </NuxtLink>
            </h1>
            <p class="text-sm text-neutral-500">
              Product-ops blocker tracking built on NuxtHub.
            </p>
          </div>

          <UButton
            v-if="!loggedIn"
            to="/api/auth/github"
            icon="i-simple-icons-github"
            label="Login with GitHub"
            color="neutral"
            size="sm"
            external
          />

          <div
            v-else
            class="flex flex-wrap items-center gap-2"
          >
            <UButton
              to="/dashboard"
              icon="i-lucide-layout-dashboard"
              label="Dashboard"
              :color="$route.path === '/dashboard' ? 'primary' : 'neutral'"
              variant="ghost"
            />
            <UButton
              to="/blockers"
              icon="i-lucide-flag"
              label="Blockers"
              :color="$route.path === '/blockers' ? 'primary' : 'neutral'"
              variant="ghost"
            />
            <UDropdownMenu
              v-if="user"
              :items="items"
            >
              <UButton
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-chevron-down"
              >
                <UAvatar
                  :src="`https://github.com/${user.login}.png`"
                  :alt="user.login"
                  size="3xs"
                />
                {{ user.login }}
              </UButton>
            </UDropdownMenu>
          </div>
        </template>

        <NuxtPage />
      </UCard>
    </UContainer>
  </UApp>
</template>

<style lang="postcss">
body {
  @apply bg-neutral-50 font-sans text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50;
}
</style>
