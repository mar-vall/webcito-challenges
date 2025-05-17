// astro.config.mjs
import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',

  integrations: [
    preact(),
    // netlify({ mode: 'functions' }) // ⚠️ esto es crucial
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: netlify()
})