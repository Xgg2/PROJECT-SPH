import Vue from 'vue'
import App from './App.vue'
import Typenav from './components/TypeNav/Typenav';//引入三级联动组件
//导入路由插件
import VueRouter from 'vue-router';
//引入路由
import router from "@/router";
//三级联动请求
import {reqCategoryList} from './api/index';
//引入vuex
// import Vuex from 'vuex';//引入插件vuex
import store from "./store/index";
//引入mockServe文件
import './mock/mockServe';
//轮播图全局组件
import Caiousel from "@/components/Carousel/Caiousel";
//导入分页器 并设为全局组件
import Pagination from "@/components/Pagination/Pagination";
//导入api文件中index所有接口请求函数
import * as API from '@/api';
//按需引入element-ui我们要使用的组件
import { Button, MessageBox } from 'element-ui';
//导入懒加载插件
import VueLazyload from "vue-lazyload";
//导入图片加载
import loadimg from  '@/assets/loading.gif';

Vue.config.productionTip = false;
//将三级联动组件配置成全局组件
Vue.component('Type-nav',Typenav);
//将Swiper轮播图注册为全局组件
Vue.component('Caiousel',Caiousel);
Vue.component('Pagination',Pagination);//分页器全局组件注册
reqCategoryList();
Vue.use(VueRouter);//使用路由插件
//使用element-ui组件
Vue.component(Button.name, Button);
//使用图片懒加载插件
Vue.use(VueLazyload,{ //Vue.use()一调用，实质是调用插件install方法
  loading:loadimg,
});
let vm=new Vue({
  el:'#app',
  render: h => h(App),
  //注册路由器   kv一直省略v
  router,
  //注册vuex仓库
  store,
  //全局事件总线
  beforeCreate() {
    Vue.prototype.$bus=this;
    Vue.prototype.$Api=API;//把请求函数放到Vue原型对象上。不光vm可以访问到，组件实例对象也就可以访问到
    Vue.prototype.$alert=MessageBox.alert;
    Vue.prototype.$msgbox = MessageBox;
  }


});
// console.log(vm)
