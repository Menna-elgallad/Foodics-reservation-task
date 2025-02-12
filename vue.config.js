const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.foodics.dev/v5", 
        changeOrigin: true,
        secure: false, 
        pathRewrite: { "^/api": "" }, // Optional: Rewrite `/api` to `/`
        
      },
    },
  },
})
