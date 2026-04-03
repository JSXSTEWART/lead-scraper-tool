export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'slate'
    },
    container: {
      base: 'max-w-5xl'
    },
    card: {
      slots: {
        header: 'flex flex-wrap items-center justify-between gap-3'
      },
      body: 'space-y-5'
    }
  }
})
