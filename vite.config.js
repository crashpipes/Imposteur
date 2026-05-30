import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite minimale : React + base relative pour ouvrir le build n'importe où
export default defineConfig({
  plugins: [react()],
  base: './',
})
