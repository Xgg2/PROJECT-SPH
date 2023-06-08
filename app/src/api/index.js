//此文件，进行所有接口的统一管理
import axs from "@/api/request";
import mockReq from "@/api/mockRequest";
//三级联动接口地址
//http://39.98.123.211:8510/api/product/getBaseCategoryList   GET  无参数

//存在跨域问题                               注意：最前面的/api1是我们自己加上去的,因为有跨域问题，在这里就是控制请求是否走代理
// export const reqCategoryList =()=> axs({url:'/api1/product/getBaseCategoryList',method:'GET'});//这里调用会返回一个axios请求可以使用.then和.catch进行处理
export const reqCategoryList =()=> axs.get('/api1/product/getBaseCategoryList');//接口的/api在我们配置axios实例对象的时候使用BaseURl设置了默认的会自动添加到路径上
//这里向本机服务器请求的地址是/api1/api/product/getBaseCategoryList  ，/api1是对接对应的代理服务器的，当对接上以后，代理服务器向对应的指定服务器发送请求路径，并且将/api1替换为空，从而完成了一次跨域请求

//mock假请求部分 获取Home首页banner轮播图的接口
export const reqGetBannerList=()=>mockReq.get('/banner');//函数返回一个请求/mock/banner的假的axios实例

//mock家请求部分  获取Home首页floors轮播图的数据
export const reqGetFloorsList=()=>mockReq({method:'get',url:'/floors'});//请求 返回一个带有状态，带有数据的promise对象。

//获取搜索模块的数据，Search路由组件的请求 post类型的请求，这里要带参数给服务器，调用函数的时候可以传递参数，在这里形参接收，url地址里面就可以携带参数。                        //接收Search组件的小仓库actions中调用这个函数时传递的参数。
export const reqSearchShangPinList=(canshu)=>{//只有调用这个函数时，axios请求实例才会起作用。
    return axs({//调用reqSearchShangPinList函数的时候这个axios实例请求才会被执行（发送）
        method:'post',
        url:'/api2/list',
        data: canshu,//传过来的参数，形参接收，放到这里，以data的方式传递给服务器。
    });//  这里api2就是控制是否走代理解决跨域
}
//涉及到参数的传递（记住这里可不是路由减传递参数），
// axs({
//      method:'post',
//      url:'/user/?id=11',
//      params:{firstName:'Tom'},
//      data:{//或者这样传参
//          listName:'Peter',
//      }
//      })

//商品详情
export const reqShangPinXiangQingList =(skuId)=>{
    return axs({
        method:'get',
        url:`/api3/item/${skuId}`,//  /{ skuId }//传一个参数 就是Search组件中的点击商品的商品Id
       //传给服务器的参数
    })
}

//购物车 http://gmall-h5-api.atguigu.cn/api/cart/addToCart/{ skuId }/{ skuNum }   商品详情页加入购物车按钮请求 || 修改购物车产品数量
export const reqAddOrUpdataShopCart=(skuId,skuNum)=>{ //请求的相同的服务器地址，可以使用一个代理  给服务器传递参数，服务器记录一下（不会返回数据）
    return axs({
        method:'post',//在请求头加入UUID 标识
        url:`/api3/cart/addToCart/${skuId}/${skuNum}`,//http://localhost:8080/api/api3/cart/addToCart/12/1 后面两个就是传给服务器的参数
    })
}

//购物车列表接口   /api/cart/cartList   不用带参数
export const reqCartLists=()=>{
    return axs({method:'get',url:'/api3/cart/cartList'}) //走api3的代理
}

//切换商品选中状态  /api/cart/checkCart/{skuID}/{isChecked}  商品id 以及商品选中状态 // 0代表取消选中 // 1代表选中  传递给服务器
export const reqShopCartSkuIsChecked=(skuID,isChecked)=>{
    return axs({method:'get',url:`/api3/cart/checkCart/${skuID}/${isChecked}`});//为了解决跨域 在这里我们还是使用以前的代理
}

//删除购物车商品  /api/cart/deleteCart/{skuId}  将要删除的商品id传递给服务器 ，服务器不会返回数据
export const reqRemoveShop=(skuId)=>{
    return axs({method:'DELETE',url:`/api3/cart/deleteCart/${skuId}`});//传递一个商品id给服务器 ，服务器对数据库数据数据的处理
}
//注册页面 验证码 /api/user/passport/sendCode/phone   这里需要传递一个参数phone手机号【验证后的】给服务器
export const reqSendCode=(phone)=>{
    //用户没有输入电话的情况，控制台会有错误
      return phone ? axs({method:'get',url:`/api3/user/passport/sendCode/${phone}`}) : '';//传递手机号 这里走的/api3代理

}
//用户注册  /api/user/passport/register  传手机号，密码，验证码给服务器 ，如果手机号未被注册会被存入数据库中
export const reqUserRegister=(data)=>{//接收actions中调用此函数返回过来的表单参数
    return axs({
        method:'post',
        url:'/api3/user/passport/register',
        data,//传给服务器
    })
}

//登录 /api/user/passport/login 传给服务器参数账号与密码为必选项
export const reqUserLogin=(data)=>{
    return axs({
        method:'post',//请求类型不要写错
        url:'/api3/user/passport/login',//走的是api3的代理
        data,
    })
}

//登陆成功后 获取用户信息  /api/user/passport/auth/getUserInfo
export const reqUserInfo=()=>{
    return axs({method:'get',url:'/api3/user/passport/auth/getUserInfo'})
}

//退出登录 /api/user/passport/logout  告诉服务器要退出登录【服务器会删除对应的token】
export const reqUserLogout=()=>{
    return axs({method:'get',url:'/api3/user/passport/logout'});//走 /api3代理
}

//获取用户地址信息
// export const reqAddressInfo=()=>{  //这个接口 拿不到用户收获地址信息数据 ，使用mock
//     return axs({method:'get',url:'/api3/user/userAddress/auth/findUserAddressList'})
// }
export const reqMockAddressInfo=()=>{  //这个接口 拿不到用户收获地址信息数据 ，使用mock
    return mockReq({method:'get',url:'/addressinfo'});//这里数据在本地，不需要代理
}

//获取订单交易页信息【用户商品清单】  /api/order/auth/trade  这里请求头带上token，才可以返回数据
export const reqUserTrade=()=>{
    return axs({method:'get',url:'/api3/order/auth/trade'});//走api3代理
}

//用户提交订单  /api/order/auth/submitOrder?tradeNo={tradeNo}  后面的参数是订单编号  ，data中传给服务器的参数为【姓名，电话，地址，支付方式，订单备注，存储多个商品订单的数组】
export const reqSubmitOrder=(tradeNo,data)=>{
    return axs({method:'post',url:`/api3/order/auth/submitOrder?tradeNo=${tradeNo}`,data})
}

//获取订单支付信息  /api/payment/weixin/createNative/{orderId}
export const reqOrderInfo=(orderId)=>{ //别忘记走代理
    return axs({method:'get',url:`/api3/payment/weixin/createNative/${orderId}`});//把Trade组件中点击提交订单，请求返回的订单号【路由跳转传参】，Pay支付界面，挂载发请求时传给服务器。
}

//查询订单支付状态  /api/payment/weixin/queryPayStatus/{orderId}  ，弹窗弹出，用户要支付的时候，就要不断发请求问服务器 用户的支付状态
export  const reqPayStatus=(orderId)=>{
    return axs({method:'get',url:  `/api3/payment/weixin/queryPayStatus/${orderId}`});//不要忘记走代理
}

//获取我的订单列表 【个人中心】   /api/order/auth/{page}/{limit}   传给服务器的参数说明 page:当前页码 limit:展示的数量
export const reqMyOrder=(page,limit)=>{
    return axs({method:'get',url:`/api3/order/auth/${page}/${limit}`})
}