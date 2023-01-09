import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/library.js'),
      name: 'vue-command',
      fileName: 'vue-command',
    },
    outDir: './dist',
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },

  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.vue']
  }
})
