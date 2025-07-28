// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss(), ],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  // ✅ Add this to fix 404 errors on page reload (SPA fallback)
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
