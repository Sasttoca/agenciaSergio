import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/agenciaSergio/', // Reemplaza con el nombre exacto de tu repositorio de GitHub (fíjate en mayúsculas/minúsculas)
})