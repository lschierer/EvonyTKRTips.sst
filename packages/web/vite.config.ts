import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        myelement: 'src/my-element.ts',
        ASCompoents: 'src/ASComponents.tsx'
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: /^lit/,
    },
  },
})
