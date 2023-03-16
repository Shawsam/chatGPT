import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"     //需要安装@types/node，否则编译报错

export default defineConfig({
  plugins: [vue()],
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
