import {reqSearchShangPinList} from "@/api";
const actions={
    //解构对象 通过属性名    这里可以接收组件传递的数据 在这里我们可以设置一个默认参数（如果没有数据传递，我们设置一个默认参数{}空对象，也就可以保证请求成功）
    async getShangPinList({commit},val){         //注意在这里调用list商品接口，至少要传递一个空对象。不然会请求失败。
        const searchShangPinList=await reqSearchShangPinList(val);//请求返回一个带有状态的，带有数据的promise对象
        if(searchShangPinList.code===200){
            commit('SEARCHSHANGPINLIST',searchShangPinList.data);
        }

    }
}
const mutations={
    SEARCHSHANGPINLIST(state,searchShangPinListval){
        state.searchShangPinLists=searchShangPinListval;
    }
}
const state={
    searchShangPinLists:{},//返回过来的参数是对象，所以我们在这里设置一个空对象。
}
//计算属性，为了简化数据而设。
const getters={

    //下面商品列表的数据
    goodsList(state){//getters也可以访问到state
        return state.searchShangPinLists.goodsList || [];//如果没有网络（网慢）就拿不到请求的数据中的对应的值，里面没有值就是undefined                                       //网络慢前面读取不到请求的对象中的相关属性值，就是undefined为false，后面生                                                 //效，就为[]，v-for遍历不了undefined
    },                                                    //let obj={} ,console.log(obj.num);//undefined
    //顶上品牌的数据
    trademarkList(state){
        return state.searchShangPinLists.trademarkList || [];
    },
    //顶上一些选择信息的一些数据
    attrsList(state){
        return state.searchShangPinLists.attrsList || [];
    }

}
const SearchVc={
    namespaced:true,//开启命名空间
    actions,
    mutations,
    state,
    getters

}
export default SearchVc;