import {reqCategoryList,reqGetBannerList,reqGetFloorsList} from '../../api/index'
const actions={
    // getShangPinList(state){
    //     reqCategoryList().then(response=>{
    //         state.spList=response.data;
    //     }).catch(err=>{
    //         console.log(err.message)
    //     })
    // }
    //使用async与await
    async getShangPinList({commit}){//在这里结构context第一个参数（对象），得到对应的commit方法，第二个参数是组件如果有参数传递，就可以接收
       let spListdata=await reqCategoryList();//await后面接promise对象
        // console.log(spListdata)
        if(spListdata.code===200){
            commit('GETSHANGPINLIST',spListdata.data);//联系mutations对象，并传入请求的数据
        }
    },
    // axios.get()请求的时候 返回一个带有状态的promise对象（我们在响应拦截器那里一斤设置成功和失败的回调处理了）
    async mockgetbannerlist({commit}){
        // console.log('发送请求actions中')
        let mockbannerlist= await reqGetBannerList();//发送mock虚假请求  await等待异步任务出结果
        if(mockbannerlist.code===200){
            commit('MOCKGETBANNERLIST',mockbannerlist.data);//传入请求数据
        }
        // console.log(mockbannerlist);
    },
    //使用async处理异步请求
    async mockgetfloorslist({commit}){
        let mockfloorslist=await reqGetFloorsList();//返回一个带有状态的 带有数据的promise对象
        if(mockfloorslist.code===200){
            commit('MOCKGETFLOORLIST',mockfloorslist.data);//联系mutations并传递数据
        }
    }
};//处理业务逻辑，请求服务器，拿数据
const mutations={//处理state中储存的数据
    GETSHANGPINLIST(state,val){//把actions对象中方法请求过来的数据存入，储存数据的state当中
        state.spList=val;
    },
    MOCKGETBANNERLIST(state,mockbannerlist){
        state.bannerList=mockbannerlist;
        // console.log('将请求的数据放入state中')
    },
    MOCKGETFLOORLIST(state,mockfloorslist){
        state.floorslist=mockfloorslist;
        // alert('放入floors数据到state中')
    }
};//处理数据state中的
const state={
    spList:[],//起始值 ，根据服务器返回数据的类型设置
    bannerList:[],
    floorslist: [],
};//储存数据
const getters={};
const  HomeVc={//暴露对应组件的小仓库
    //命名空间是否开启
    namespaced:true,//命名空间
    actions,
    mutations,
    state,
    getters
}
export default HomeVc