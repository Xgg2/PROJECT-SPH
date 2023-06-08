const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap:false,//打包不生成.map文件
  transpileDependencies: true,
  lintOnSave:false,//忽略语法提示
  //配置脚手架代理，解决跨域问题
  devServer:{
    proxy:{
      '/api1':{//让请求走代理，
        target:'http://39.98.123.211:8510/',//请求数据的服务器ip地址
        pathRewrite:{'/api1':''},//删除请求路径上对应代理的一个路径
      },
      //配置Search路由组件商品list的请求代理
      '/api2':{
        target: 'http://gmall-h5-api.atguigu.cn',
        pathRewrite: {'/api2':''},//代理走完了就把路径上控制是否走代理的路径替换为空，要不路径不对拿不到数据
      },
      '/api3':{
        target:'http://gmall-h5-api.atguigu.cn',
        pathRewrite:{'/api3':''},//替换代理中带有/api3地址（控制是否走代理）
      }

    }
  }
})
