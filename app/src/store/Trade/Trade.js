import {reqUserTrade,reqAddressInfo,reqMockAddressInfo} from "@/api";

const actions={
    //用户收货地址信息
    // async getAddressInfo(){//请求的时候会带上token
    //     let response=await reqAddressInfo();
    //     console.log(response)
    // },
    async getMockAddressInfo({commit}){//因为上面的对应接口饭hi不了数据【用户收货地址信息】，我们使用mock模拟假数据
        let response=await reqMockAddressInfo();
       if(response.code===200){
           commit('GEYMOCKADDRESSINFO',response.data);
       }
    },
    //用户商品清单
    async getUserTrade({commit}){
        let response=await reqUserTrade();//等待请求返回结果【成功或失败的promise对象 带的服务器返回的数据】
        if(response.code===200){
            commit('GETUSERTRADE',response.data);
        }
    },
};
const mutations={
    GEYMOCKADDRESSINFO(state,addressinfo){
        state.addressinfo=addressinfo;
    },
    //将actions请求的传过来的数据，存入state中
    GETUSERTRADE(state,tradeinfo){
        state.tradeinfo=tradeinfo;
    }
};
const state={
    addressinfo:[],//用户收货信息数据 初始为空数组
    tradeinfo:{},//初始为空对象，用户商品清单
};
const getters={
    //简化用户商品清单
    userDetailArrayList(state){
        return state.tradeinfo.detailArrayList || [];
    }
};
const TradeVc={
    namespaced:true,//开启命名空间
    actions,
    mutations,
    state,
    getters
}

export default TradeVc;