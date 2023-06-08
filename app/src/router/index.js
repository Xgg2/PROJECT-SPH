import VueRouter from "vue-router";
//导入需要配置的组件（配置成路由组件）
// import Home from "@/pages/Home/Home";
import Search from "@/pages/search/Search";
import Login from "@/pages/Login/Login";
import Register from "@/pages/Register/Register";
import Detail from "@/pages/Detail/Detail";
import AddCartSuccess from "@/pages/AddCartSuccess/Addcartsuccess";
import ShopCart from "@/pages/ShopCart/ShopCart";
//导入vuex仓库
import store from "@/store";
import Trade from "@/pages/Trade/Trade";
import Pay from "@/pages/Pay/Pay";
import Paysuccess from "@/pages/PaySuccess/Paysuccess";
import Center from "@/pages/Center/Center";
//动态引入Home路由组件【路由懒加载】【高效】
const Home=()=>import('@/pages/Home/Home');//动态引入路由组件可以这样写，也可以直接写在路由配置项中

//个人中心二级路由组件
import Myorder from "@/pages/Center/Myorder/Myorder";
import Grouporder from "@/pages/Center/Grouporder/Grouporder";
//先将VueRouter.prototype.push保存一份
let originPush=VueRouter.prototype.push;//原型上的一个方法
//重写push和replace  ,在VueRouter原型对象上添加push方法，其实例对象$router就可以访问到   （想治本，如果路由组件太多编程式路由导航太多就需要每一个都要写）  ，告诉原来的push方法你往哪里跳转传递什么参数，
/**
 * 第一个参数：跳转路径push或name（传递的query或params参数）
 * 第二个参数：成功的回调
 * 第三个参数：失败的回调
 * */
VueRouter.prototype.push=function (location,resolve,reject){
            //构造函数方法中的this指向调用方法的
    if(resolve && reject){//成功与失败的回调 .then 和.catch都传了，就执行所传的//原型链上重新添加一个push方法，push方法中的this谁调用就指向谁
        //originPush方法如果我们originPush()这样调用的化this指向的时window，所以使用call调用并将其this指向修改为调用新push的VueRouter实例对象
      originPush.call(this,location,resolve,reject);//后面是否有成功或失败的回调，有就直接传过去 （当调用新加的push方法之后，使用的call方法帮我们调用原来的旧的push方法，并修改this指向，传入原来该有的参数），他有成功或失败的回调就执行，没有就给一个空回执行
  }
  else{
      originPush.call(this,location,()=>{},()=>{});//没有就传没有传成功与失败的回调，就执行这一个空回调
  }
    // console.log(this);//$router  VueRouter构造函数方法中 this指向调用方法的实例对象$router。$router访问的是VueRouter原型对象身上的方法
}
let originReplace=VueRouter.prototype.replace;
VueRouter.prototype.replace=function (location,resolve,reject){
    if(resolve && reject){
        originReplace.call(this,location,resolve,reject);
    }
    else{
        originReplace.call(this,location,()=>{},()=>{});
    }
}
// console.dir(VueRouter)
// console.log(VueRouter.prototype.push)
const router=new VueRouter({
    routes:[
        //配置路由  一级
        {
            name:'home',
            path:'/home',
            component:Home,
            meta:{dispyFooter:true}
        },
        {
            name:'search',
            path:'/search/:keyword?',//占位   占位后面加个？就是此params参数可传可不传
            // component:Search,
            component:()=>import('@/pages/search/Search'),//路由组件的动态引入
            meta:{dispyFooter:true},
            //可以了解一下，通常路由组件接收参数时使用$route.query.xx或$route.params.xx这种形式
            //对象法  额外给search路由组件传递props参数
            // props:{canshu:'hello'}
            //布尔值法
            // props:true,//只能传递params参数，
            //函数法  可以传递query参数以及params参数  就是使$route.query.xx或$route.params.xx路由组件接收数据时，简单形式props中接收的数据参数直接使用。
            // props({query:{k},params:{keyword}}){   //这里的$route是search组件的对应$route，在Header组件中已经使用了$route.push()传递了query以及params参数，只是在这里这样写，Search组件使用props接收，在模板中使用的使用简便，不需要$route.query.xx或$route.params.xxx  （简单说就是将Header组件传给Search组件的query以及params重新在这里返回到Search组件props中接收数据）
            //     return {k,keyword};
            // }
        },
        //在注册或登录路由组件显示的时候，就隐藏Footer组件
        {
            name:'login',
            path:'/login',
            component:Login,//路由组件在这里就相当于注册了，就不用在别的地方注册了
            meta:{dispyFooter:false}
        },
        {
            name:'register',
            path:'/register',
            component:Register,//路由组件在这里就相当于注册了
            meta:{dispyFooter:false}
        },
        //重定向  在项目跑起来的时候，访问/，的时候，立马定向到首页  🔺
        {
            path:'*',
            redirect:'/home'
        },
        {
            path:'/detail/:Id?',//商品详情路由组件
            name:'detail',
            component:Detail,
            meta:{dispyFooter:true},
        },
        {
            name:'AddCartSuccess',
            // path:'/addcartsuccess/:skuNum/:skuShuXing',
            path:'/addcartsuccess/:skuNum/:color/:banben',
            component:AddCartSuccess,
            meta:{dispyFooter:true},//展示Footer
        },
        {
            path:'/shopcart',
            name:'shopcart',
            component:ShopCart,
            meta:{dispyFooter:true},

        },
        {
            path:'/trade',
            name:'trade',
            component:Trade,
            meta:{dispyFooter:true},
            beforeEnter(to,from,next){
                //用户想要去交易页，必须从购物车去
                if(from.path==='/shopcart' || from.path==='/pay'|| from.path==='/' || from.path==='/login'){  //从pay路由组件按上一步，也不会过来【用户想要改一下地址，允许用户回来】 用户刷新从自己跳到自己也让进 【一旦刷新 这里自己往自己身上跳，from的path为'/'】
                    next();//只管交易页
                }
                else {
                    // console.log(to,'----to');
                    // console.log(from,'-----from');
                    next(false);//还是为当前页 来的路径不是'/shopcart',就会被阻断，并且路径还是from的path
                }
            }
        },
        {
            path:'/pay',//配置付款路由组件
            name:'pay',
            component:Pay,
            meta:{dispyFooter:true},
            beforeEnter(to,from,next){
                //用户想要进这个路由组件【支付】，只能从trade交易页面进来【不从交易页进来的话，用户名地址电话获取不到】
                if(from.path==='/trade' || from.path==='/'){//是从交易页来
                    next();//放行
                }
                else{//除了交易页【trade】其他地方想要来支付页，就阻止了，从哪来还是呆在哪里【不让到pay支付界面】
                    // console.log(to,'----to');
                    // console.log(from,'-----from');
                    next(false);
                }
            }
        },
        {
            path:'/paysuccess',
            name:'paysuccess',
            component:Paysuccess,
            meta:{dispyFooter:true},
        },
        //个人中心以及路由组件
        {
            path:'/center',
            name:'center',
            component:Center,
            meta:{dispyFooter:true},
            //配置个人中心路由组件二级路由
            children:[
                {
                    path:'/center/myorder',
                    name:'myorder',
                    component:Myorder,
                },
                {
                    path:'/center/grouporder',
                    name:'grouporder',
                    component:Grouporder
                },
                //重定向我的订单二级路由组件
                {
                    path:'/center',//二级路由重定向 这里写对应的一级路由的路由路径
                    redirect:'/center/myorder',
                }

            ]
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { y: 0 }  //top不能用
        // return new Promise((resolve, reject)=>{
        //     setTimeout(function (){
        //         resolve({y :0})
        //     },1000)
        // })
    },
});
//全局前置路由守卫
router.beforeEach(async (to,from,next)=>{
    //to：到哪去 from：从哪来 next：next()放行   ，next(path)--放行到指定路由组件
    //登录以后，就不允许用户跳到login组件
    //判断用户是否登录
    // next();
    // let token=store.state.RegisterOrLoginVc.token;//用户登录成功之后就会将服务器返回的token存在注册与登录组件的小仓库中
    let token=localStorage.getItem('token');
    let name=store.state.RegisterOrLoginVc.userInfo.name;//不能使用整个对象判断是否有用户数据，拿对象中的每个属性判断【空对象也是true】
    if(token){//小仓库中有token，用户已登陆
        // console.log(token)
        //跳到登陆页面之后，如果用户登陆了，就在跳到用户想要去的地方。
        // if(to.path){//如果有token了，表示用户已经登陆了。
        //     next(to.path);//用户登陆后，就在跳到用户要去的地方。
        // }
        //判断用户是否是去login登录或register注册组件 【登录后就不允许过去】
        if (to.path==='/login' || to.path==='/register'){
            next('/home');//不让去，回到home首页
        }
        else{//用户去的是除了登录与注册组件的其他路由组件
            //在这里我们解决每一个路由组件挂载时带着token拿用户数据【放到注册与登录组件的仓库中userInfo】这一重复性操作
            //判断注册与登录组件小仓库中是否有用户数据--为了展示Header组件对应的用户数据
            if (name){//有用户数据，可以展示Header中的对应用户数据【用户名 | 退出登录】
                console.log('@@',name);
                next();
                // store.state.RegisterOrLoginVc.userInfo={};
            }
            // else {
            //     next();
            // }
            else {//没有用户数据，Header中的用户信息展示不上
                //发请求【请求头带着token字段】，拿用户数据
                try {
                   let res=await store.dispatch('RegisterOrLoginVc/getUserInfo');//【异步】//拿用户数据，放在注册与登录组件小仓库中
                    console.log('@@还没有用户数据，先发请求拿用户数据',localStorage.getItem('token'))

                    //等待用户数据放进去之后 放行
                    next();
                }
                catch(err) {//请求用户数据失败【请求时没有带token请求头字段 或 token过期】捕获错误
                    //删除本地储存中的token，以及用户数据【注册与登录组件小仓库中的】
                    await store.dispatch('RegisterOrLoginVc/getUserLogout');//【注意】这里必须使用await
                    next('/login');//等待上面删除相关数据以后，放行到登陆页
                    alert('认证过期')
                }
            }
        }
    }
    else{//未登录
       //未登录 不允许用户去：交易页【trade】 ，支付页【pay ,paysuccess】 ，个人中心【center】
        let toPath=to.path;//用户要去的路径                                    //路径带有center就算为个人中心【因为有二级路由组件】
        if(toPath==='/trade' || toPath==='/pay' || toPath==='/paysuccess' || toPath.indexOf('/center')>=0){
            //用户未登录想要去这些路由组件，就先跳到登陆界面让用户登陆
            next(`/login?wanto=${toPath}`);//跳到登陆页面之后，如果用户登陆了，就在跳到用户想要去的地方。 这里利用路由传参把要to的路径【传给login路由组件】
        }
        else{//非交易页 支付页 个人中心就可以去 放行
            next();
        }
        alert('未登录')
    }




})
export default router;