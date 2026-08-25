import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // When embedded, we might need to allow external connections if using ngrok
    host: true,
    allowedHosts: true,
  },
});
