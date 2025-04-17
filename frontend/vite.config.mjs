import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  const frontendRoot = process.cwd();

  // Charger les variables dans le bon ordre
  const modeEnv = loadEnv(mode, frontendRoot, 'VITE_'); // .env.[mode]
  const baseEnv = loadEnv('', frontendRoot, 'VITE_'); // .env et .env.local

  // Fusionner les variables en donnant la priorité à .env.local
  const env = { ...modeEnv, ...baseEnv };

  // Debug plus détaillé
  console.log('\nContenu de .env.local:');
  try {
    const localEnvContent = fs.readFileSync(path.join(frontendRoot, '.env.local'), 'utf-8');
    console.log(localEnvContent);
  } catch (error) {
    console.log('Erreur de lecture de .env.local:', error.message);
  }

  // Debug des fichiers et variables
  console.log("\nDébug des fichiers d'environnement:");
  [
    '.env',
    '.env.local',
    '.env.development',
    '.env.development.local',
    '.env.production',
    '.env.production.local',
  ].forEach((file) => {
    const filePath = path.join(frontendRoot, file);
    console.log(`${file}: ${fs.existsSync(filePath) ? 'existe' : "n'existe pas"}`);
  });

  console.log("\nVariables d'environnement chargées:");
  Object.entries(env).forEach(([key, value]) => {
    if (key.startsWith('VITE_')) {
      console.log(`${key}: ${value}`);
    }
  });

  return {
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
    envDir: frontendRoot,
    define: {
      __ENV__: JSON.stringify(env),
    },
  };
});
