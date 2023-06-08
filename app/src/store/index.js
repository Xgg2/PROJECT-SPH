import Vue from "vue";
import Vuex from "vuex";
import HomeVc from "@/store/Home/Home";
import SearchVc from "@/store/Search/Search";
import DetailVc from "@/store/Detail/Detail";
import ShopCartVc from "@/store/ShopCart/Shopcart";
import RegisterOrLoginVc from "@/store/Register/RegisterOrLogin";
import TradeVc from "@/store/Trade/Trade";
Vue.use(Vuex);//使用插件vuex
// const actions={};//处理业务逻辑，请求服务器，拿数据
// const mutations={//处理state中储存的数据
// };//处理数据state中的
// const state={};//储存数据
// const getters={};//计算属性，基于state中已有的数据进行加工处理 ，简化仓库数据
//Vuex是一个对象，身上的Store 是一个构造函数，创建一个store实例对象，使用new调用构造函数
const store=new Vuex.Store({
    modules:{
        HomeVc,//组件小仓库在modules对象中注册
        SearchVc,//Search组件小仓库
        DetailVc,//详情页组件小仓库
        ShopCartVc,//购物车组小件仓库
        RegisterOrLoginVc,//注册组件小仓库
        TradeVc,//订单交易页组件小仓库
    }

})

export  default store;//向外暴露 ，在main.js中引入配置项中注册
