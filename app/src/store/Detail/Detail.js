import {reqShangPinXiangQingList,reqAddOrUpdataShopCart} from "@/api";
import {getuuId} from "@/tools/uuid_";//导入生成uuid的函数【会放在本地存储中一份，放在这个小仓库state数据中一份】
//获取商品详细信息的方法
const actions={
    async getShangPinList({commit},id){
        let response=await reqShangPinXiangQingList(id);//axios请求返回一个带有状态 带有数据的promise对象
        if(response.code===200){
            commit('GETSHANGPINLIST',response.data);
        }
    },
    //将商品添加到购物车                    解构传递过来的对象
    async addorupdateshopcart({commit},{skuId,skuNum}){//async函数 会返回一个promise对象【下面判断就是根据请求结果，通过promise对象携带的状态 到调用addorupdateshopcart的地方，dispatch联系action对应函数的地方 】
        let response=await reqAddOrUpdataShopCart(skuId,skuNum);//传递请求参数
        if(response.code===200){ //请求成功参数传递成功，服务器记录一下，不会返回数据，就不用联系mutations传数据过去，将数据存入sate了
                return 'ok';//表示服务器服务器响应了请求，并处理了参数
        }
        else {//请求未成功 ，服务器没有记录商品
            return Promise.reject(new Error('err'));//请求失败 返回一个错误对象 让catch捕获到
        }

    }
};
const mutations={
    GETSHANGPINLIST(state,val){
        state.shangpinXiangQingData=val;
    },
};
const state={
    shangpinXiangQingData:{},
    uuid:getuuId(),//调用引入的生成在本地存储的uuid函数，还回把那个id返回到这里。这里的uuid页面一刷新就出来了
};
const getters={//计算属性简化数据
    categoryView(state){
        return state.shangpinXiangQingData.categoryView || {};  //请求数据还没有过来的时候，shangpinXiangQingData还是空对象，
    },                                                          //读取空对象中没有的属性categoryView，就是undefined，组件中通过                                                     //categoryView拿名称的时候，就相当于undefined.name就会报错
    skuInfo(state){
        return state.shangpinXiangQingData.skuInfo || {};
    },
    spuSaleAttrList(state){
        return state.shangpinXiangQingData.spuSaleAttrList || [];
    }
};

 const DetailVc={
    namespaced:true,//开启命名空间
    actions,
    mutations,
    state,
    getters
}
export default DetailVc;