import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './' // Esto asegura que busque los archivos en la ruta relativa correcta
})