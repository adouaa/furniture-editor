import { defineConfig } from "vite";

export default defineConfig({
  base: "/furniture-editor/", // 修改为仓库名称
  build: {
    outDir: "dist", // 打包输出目录
    assetsDir: "assets", // 静态资源目录
    sourcemap: false, // 不生成 sourcemap 文件
  },
});
