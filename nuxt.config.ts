export default defineNuxtConfig({
  // CSS Dateien global einbinden
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  // Vuetify muss transpiliert werden
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  devtools: { enabled: true }
})