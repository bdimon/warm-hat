import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vite автоматически загружает переменные окружения из следующих файлов:
  // .env                # загружается во всех случаях
  // .env.local          # загружается во всех случаях, игнорируется git
  // .env.[mode]         # загружается только в указанном режиме (development/production)
  // .env.[mode].local   # загружается только в указанном режиме, игнорируется git
  
  // console.log(`Текущий режим: ${mode}`);
  // console.log(`Переменные окружения VITE_*: ${Object.keys(process.env).filter(key => key.startsWith('VITE_'))}`);
  
  return {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3010',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      visualizer({
        template: 'treemap', // or 'sunburst', 'network'
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        sourcemap: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
