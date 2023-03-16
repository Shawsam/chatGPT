import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"                                  //需要安装@types/node，否则编译报错
import { visualizer } from 'rollup-plugin-visualizer';   //打包分析
import viteCompression from 'vite-plugin-compression'    //gzip压缩


export default defineConfig({
  plugins: [
    vue(),
    visualizer({
       open: true
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  resolve: {
    //别名配置
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    //css预处理器配置
    preprocessorOptions:{
      less:{}
    }
  },
  build: { 
    terserOptions: {
      compress: {  //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    // chunkSizeWarningLimit: 1500,大文件报警阈值设置,不建议使用
    rollupOptions: {
      output: {   
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) { //静态资源分拆打包
        if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    //关闭文件计算
    reportCompressedSize: false,
    //关闭生成map文件 可以达到缩小打包体积
    sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
  },
  server:{
    proxy: {
      '/chatgpt':{
        target: 'http://10.0.7.30:8020/',
        changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404  如果接口跨域，需要进行这个参数配置
        ws: true,           // true / false，是否代理websockets
        secure: true,       // 如果是https接口，需要配置这个参数
        rewrite:  (path) => path.replace(/^\/chatgpt\/tarsocialcmi/, "/tarsocialcmi"),
      },
      '/gpt-api':{  
        target: 'http://8.222.168.126:20021',
        changeOrigin: true, // 将基于名称的虚拟托管网站的选项，如果不配置，请求会报404  如果接口跨域，需要进行这个参数配置
        ws: true,           // true / false，是否代理websockets
        secure: true,       // 如果是https接口，需要配置这个参数
        rewrite:  (path) => path.replace(/^\/gpt-api/, "/"),
      },
    }
  }
})
