import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // 将基本公共路径设置为相对路径
  build: {
    outDir: "dist", // 打包输出目录
    assetsDir: "assets", // 静态资源目录
    sourcemap: false, // 不生成 sourcemap 文件
  },
});
