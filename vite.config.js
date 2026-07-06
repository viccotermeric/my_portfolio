import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    // Proxies /api calls to the production Vercel deployment during local dev,
    // since the chat API has no local equivalent. Requests hit the live backend.
    proxy: {
      '/api': {
        target: 'https://rishabh-trivedi-github-io.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    environment: 'node',
  },
});
