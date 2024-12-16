import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../../dist/rdf2dot-wc'),
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.js'),
      },
      // Ensure to externalize deps that shouldn't be bundled
      external: ['@viz-js/viz', 'eyereasoner'],
      output: {
        globals: {
          '@viz-js/viz': 'Viz',
          'eyereasoner': 'eyereasoner'
        },
        entryFileNames: 'rdf2dot-wc.js'
      }
    }
  }
})