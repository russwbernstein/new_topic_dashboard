import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5176,
      allowedHosts: ['topicdash.ngrok.app', 'rapperdraft.ngrok.app'],
      proxy: {
        '/tsi': {
          target: env.VITE_TSI_PROXY_TARGET || 'https://internal-api.example.com/tsi',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/tsi/, ''),
        },
        '/tagomatic': {
          target: env.VITE_TAGOMATIC_PROXY_TARGET || 'https://internal-api.example.com/tagomatic',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/tagomatic/, ''),
        },
        '/ems': {
          target: env.VITE_EMS_PROXY_TARGET || 'https://internal-api.example.com/ems',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/ems/, ''),
        },
        '/hot-topic-radar': {
          target: env.VITE_HOT_TOPIC_RADAR_PROXY_TARGET || 'https://internal-api.example.com/hot-topic-radar',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/hot-topic-radar/, ''),
        }
      },
    },
  };
});
