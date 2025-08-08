import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [tailwindcss(), react(), flowbiteReact()],
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
       { 
      find: '@/dashboard/dashboard',  
      replacement: path.resolve(__dirname, 'src/dashboard/dashboard.tsx')
    },
    ],
    preserveSymlinks: true,
  },
});
