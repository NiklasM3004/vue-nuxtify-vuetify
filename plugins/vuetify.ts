import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { defineNuxtPlugin } from 'nuxt/app' // Oder 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'light' // Hier kannst du auf 'dark' umstellen
    }
  })

  nuxtApp.vueApp.use(vuetify)
})