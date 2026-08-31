import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nexusplay/shared-types': path.resolve(__dirname, '../../packages/shared-types/src/index.ts'),
      '@nexusplay/game-engine': path.resolve(__dirname, '../../packages/game-engine/src/index.ts')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
