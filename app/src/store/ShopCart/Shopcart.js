//购物车小仓库
import {reqCartLists,reqShopCartSkuIsChecked,reqRemoveShop} from "@/api";

const actions={
    //获取购物车数据【在我们加入购物车的时候发送给服务器商品id以及数量，服务器记录在数据库中，没有给我们返回数据】
    async getCartList({commit}){//解构store对象，拿到commit
        let response=await reqCartLists();//调用函数 发请求 返回一个带有状态 带有数据的promise对象
        // console.log(response);
        if (response.code===200){
            commit('GETCARTLIST',response.data);//联系mutations 并传数据过去
        }
    },
    //商品选中状态
    async getShopCartisChecked(_,{skuId,isChecked}){//在这里我们不使用store中的commit，我们就使用占位符占个位，解构传递过来的对象
        let response=await reqShopCartSkuIsChecked(skuId,isChecked);//在这里我们也要传递参数  这里服务器也是数据库记录一下，不会返回数据 ，数据是由上面的请求返回的，这里只是把商品选中的状态传递给服务器 数据库记录一下。
        if(response.code===200){
            return 'ok'; //async函数 如果return一个非promise对象【普通的数据类型】，都会返回一个成功状态的promise对象，并且该promise对象所携带的参数就是返回的普通数据类型的数据
        }
        else {
            return Promise.reject(new Error('err'));
        }

    },
    //删除购物车商品
    async getRemoveShop(_,skuId){
        let response=await reqRemoveShop(skuId);//这里只是传递参数给服务器，服务器不会返回数据
        if(response.code===200){
            return 'ok';//返回一个成功的promise对象
        }
        else{
            return Promise.reject(new Error('err'))
        }
    },
    //删除全部选中商品
     deleteAllIsCheckShop({dispatch,getters}){//解构store对象，拿到dispatch 与getters 属性
        // console.log(dispatch)
         let allPromise=[];//存放每一次联系actions中getRemoveShop请求传参所返回的promise对象
        //知道选中的元素                      item是每一个商品对象
        getters.CartList_0.cartInfoList.forEach( item=>{//在这里我们就不需要添加async 与await了，因为dispatch联系本仓库actions函数已经使用了async与await。
            //过滤出当前选中的商品     返回一个promise对象
            let promise= item.isChecked===1 ? dispatch('getRemoveShop',item.skuId) : '';//调用actions中删除一个商品的函数，传入要删除的商品id
            // console.log(promise)
            //每完成一个就放进数组中
            allPromise.push(promise)
        });
        return Promise.all(allPromise);//有一个promise对象失败就返回失败状态，所有promise对象都是成功状态就返回成功
    },
    isCheckedAllShop({dispatch,getters},allcheck){//在调用这个函数的时候，可以传递一个promise对象
        let allIsCheckPsomise=[];
        let promise;
        // console.log(getters);//有每个商品的状态
        // console.log(allcheck);//全选按钮当前状态
        getters.CartList_0.cartInfoList.forEach(item=>{
            //传1 与传0 的两种情况
            //选中（传1的情况）：这种全部选中的情况，就是当前是选中的情况就不用变【当前就是1 不变】，当前是非选中的情况【当前是0 要变】
            //取消全选（传0的时候）：这种取消全选的情况，就是当前是非选中咋黄台的不变【当前是0 不变】，当前是选中状态【当前是1 要变】
           // let promise=item.isChecked!==1 ? dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:1}) : '';//返回promise对象
            //也可以根据全选按钮状态，为true把所有的都改为选中 ，为false把所有的都设为取消选中
            if(allcheck){//为true就是全选按钮选中状态【要全选了】
                if(item.isChecked===0){//如果商品是非选中状态
                     promise=dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:1});//要修改选中状态的商品
                }
                // else{//状态等于1的 就 不变
                //     promise=dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:1});//还是等于1 不变
                // }
            }
            else{//全选按钮是非选中状态【要取消全选了】
                if(item.isChecked===1){
                    promise=dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:0})
                }
                // else{//当前状态等于0的就不变
                //     promise=dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:0})
                // }
            }
            // promise=dispatch('getShopCartisChecked',{skuId:item.skuId,isChecked:allcheck});//也可以根据全选按钮状态，为1把所有的变为1状态，状态为0，把所有的变为取消选中 0.
            allIsCheckPsomise.push(promise);
        });
        return Promise.all(allIsCheckPsomise);
    }
};
const mutations={
    GETCARTLIST(state,cartlist){
        state.CartLists=cartlist;
    }
};
const state={
    CartLists:[],//默认为一个空数组
};
const getters={
    //返回数据数组的第一个数组元素
    CartList_0(state){//数据还没有来 ，就返回一个一样类型的空数据
        return state.CartLists[0] || {} ;//这里数组的第一个数组元素是一个对象
    },
    //这里可以接着上面计算出来的数据，接着进行计算（处理） 【这里我们在组件内进行计算】
};//可以在这里处理一下数据
const ShopCartVc={
    namespaced:true,//开启命名空间
    actions,
    mutations,
    state,
    getters
}
export default ShopCartVc;