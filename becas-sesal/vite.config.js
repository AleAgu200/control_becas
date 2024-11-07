import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: '/', // Base URL, mantén `/` para una aplicación que se sirva desde la raíz.
  plugins: [
    laravel({
      input: "resources/js/app.jsx",
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "resources/js/components"),
      "@/layouts": path.resolve(__dirname, "resources/js/layouts"),
      "@/pages": path.resolve(__dirname, "resources/js/pages"),
      "@utils": path.resolve(__dirname, "resources/js/utils"),
      "@/lib": path.resolve(__dirname, "resources/js/lib"),
    },
  },
  build: {
    outDir: "public/build", // Generar los archivos en `public/build` en lugar de sobrescribir `public`.
    emptyOutDir: true, // Vacía el directorio `outDir` antes de construir, útil para evitar archivos obsoletos.
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name]-[hash][extname]`, // Organiza los activos en una subcarpeta `assets`.
        entryFileNames: `js/[name]-[hash].js`, // Coloca los archivos de entrada en una subcarpeta `js`.
        chunkFileNames: `js/[name]-[hash].js`, // Coloca los archivos chunk en una subcarpeta `js`.
      },
    },
  },
  server: {
    https: true, // Habilitar HTTPS para el servidor de desarrollo de Vite.
  },
});
