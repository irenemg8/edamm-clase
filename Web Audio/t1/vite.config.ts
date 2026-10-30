import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { readdirSync } from 'node:fs';
// Multi-página: cada actividad es un HTML en la raíz.
const pages = Object.fromEntries(readdirSync(__dirname).filter(f => f.endsWith('.html')).map(f => [f.replace('.html', ''), resolve(__dirname, f)]));
export default defineConfig({ base: './', build: { rollupOptions: { input: pages } } });
