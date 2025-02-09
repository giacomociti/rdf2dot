import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base:  '/rdf2dot/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        overview: resolve(__dirname, 'doc/overview.html'),
        examples: resolve(__dirname, 'doc/examples.html'),
        prov: resolve(__dirname, 'doc/prov.html'),
      },
    },
  },
})