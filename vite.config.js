import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { loadEnv } from 'vite';
import fs from 'fs';

// 检查环境变量文件是否存在
const envFileExists = fs.existsSync(path.resolve(process.cwd(), '.env'));
if (!envFileExists) {
  console.warn('\x1b[33m%s\x1b[0m', '警告: .env文件不存在，部分功能可能无法正常工作');
  console.warn('\x1b[33m%s\x1b[0m', '请参考README-OAUTH.md文件创建.env文件');
}

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd());
  
  // 默认API代理目标
  const apiProxyTarget = env.VITE_API_PROXY || 'http://localhost:3030';
  
  console.log('\x1b[36m%s\x1b[0m', `当前模式: ${mode}`);
  console.log('\x1b[36m%s\x1b[0m', `API代理目标: ${apiProxyTarget}`);
  console.log('\x1b[36m%s\x1b[0m', `GitHub客户端ID: ${env.VITE_GITSTARS_CLIENT_ID ? '已配置' : '未配置'}`);
  
  const isDev = mode === 'development';
  
  const config = {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/svg-icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };

  if (isDev) {
    config.server = {
      https: {
        key: './cert/localhost.key',
        cert: './cert/localhost.crt',
      },
      host: true,
      port: '30000',
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.error('\x1b[31m%s\x1b[0m', `API代理错误: ${err}`);
              
              // 发送一个友好的错误响应给客户端
              if (!res.headersSent) {
                res.writeHead(500, {
                  'Content-Type': 'application/json',
                });
                
                res.end(JSON.stringify({
                  error: 'api_proxy_error',
                  error_description: '无法连接到API服务器，请确保本地API服务器正在运行',
                  details: err.message
                }));
              }
            });
            
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('\x1b[32m%s\x1b[0m', `API代理请求: ${req.method} ${req.url}`);
            });
            
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('\x1b[32m%s\x1b[0m', `API代理响应: ${proxyRes.statusCode} ${req.url}`);
            });
          }
        },
      },
    };
  }

  return config;
});
