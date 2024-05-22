import { defineConfig, UserConfigExport } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const config: UserConfigExport = async () => {
  return {
    plugins: [react()],
    clearScreen: false,
    server: {
      port: 1420,
      strictPort: true,
    },
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      target: "esnext",
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      sourcemap: !!process.env.TAURI_DEBUG,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/pages/index.html'),
          splashscreen: resolve(__dirname, 'src/pages/splashscreen.html')
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@services': resolve(__dirname, 'src/services'),
        '@store': resolve(__dirname, 'src/store'),
        '@styles': resolve(__dirname, 'src/styles'),
        '@fonts': resolve(__dirname, 'src/assets/fonts'),
        '@utils': resolve(__dirname, 'src/utils')
      }
    }
  }
};

export default defineConfig(config);
