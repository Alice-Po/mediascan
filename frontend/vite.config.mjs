import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  root: '.',
  build: {
    outDir: 'dist',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  server: {
    port: 5173,
  },
  envPrefix: 'VITE_',
});
