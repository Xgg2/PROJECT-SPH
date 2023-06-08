import {reqSendCode,reqUserRegister,reqUserLogin,reqUserInfo,reqUserLogout} from "@/api";
//发送手机号给服务器，返回验证码

const actions={
    //获取验证码
    async getYanZhenCode({commit},phone){
        let response=await reqSendCode(phone);//传递参数【手机号】
        if(response.code===200){
            commit('GETYANZHENCODE',response.data);//成功就联系mutations把服务器返回的验证码传递过去
            return 'ok';//调用函数返回一个成功的promise对象
        }
        else{
            return Promise.reject(new Error('err'));//返回一个失败的promise对象
        }
    },
    //用户注册
    async getUserRegister(_,user) {//因为只是把注册表单数据传递给服务器 存入数据库中，不会返回数据，不需要使用commit联系mutations，使用占位符占一个store位置。
        let response=await reqUserRegister(user)
        if(response.code===200){//根据服务器返回的状态
            return 'ok'; //async函数返回一个普通类型数据时，都是一个成功的promise对象返回
        }
        else{
            return Promise.reject(new Error('err'));
        }
    },
    //用户登录  【服务器返回用户唯一身份标识token】【以后就拿着token令牌到服务器（验证）要对应用户数据】
     async getUserLogin({commit},user){
         let response= await reqUserLogin(user);//传参给服务器
         if(response.code===200){//请求成功，服务器返回token令牌
             commit('GETUSERLOGIN',response.data.token);//联系mutations，并传服务器返回的数据过去
             return 'ok';
         }
         else{
             return Promise.reject(new Error('err'));//状态码不是200【没有成功】，返回一个失败状态的promise对象到此async函数的调用处
         }

    },
    //登录后 获取用户信息
    async getUserInfo({commit}){
        let response=await reqUserInfo();//返回一个成功或失败的promise对象
        if(response.code===200){
            commit('GETUSERINFO',response.data);//请求成功 联系mutations储存服务器返回的数据
            console.log(response.data)
            return 'ok';
        }
        // else if (response.code===208){//用户未登录【退出登录时，挂载发请求，带的是uuid字段请求头】会报错，我们在这里处理
        //     return ;   //在这里不用单独处理错误  全局路由守卫调用的地方【使用await才可以】 catch会捕获到错误【token过期，或者请求头没有token】
        // }
        else{//请求不返回code为200的成功状态码，【请求头没有token，或token失效】
            //可能退出登录，挂载发请求拿用户数据【但是已经没有token，带的是uuid请求头字段】
            return Promise.reject(new Error('err'));//这里就不需要知道是否成功与失败了
        }
    },
    //退出登录
    async getUserLogout({commit}){
        let response=await reqUserLogout();//返回带有状态带有数据的promise对象
        if(response.code===200){//根据状态码判断是否提出成功【这时服务器已经把对应的token删除了，再拿此token作为请求头字段到服务器拿用户数据，就会校验失败】
            localStorage.removeItem('token');//删除本地存储中的token
            commit('GETUSERLOGOUT');//联系mutations（操作数据），删除state中的用户信息
            return 'ok';//告诉对应联系此函数的地方【组件中】，我退出登录成功了
        }
        else{
            return Promise.reject(new Error('err'));
        }
    }

};
const mutations={
    //获取验证码 code
    GETYANZHENCODE(state,code){
        state.yanZhenCode=code;
    },
    //用户登录 token
    GETUSERLOGIN(state,token){
        state.token=token;
    },
    //登陆后 用户信息
    GETUSERINFO(state,userInfo){
        state.userInfo=userInfo;//把数据放到state中
    },
    //退出登录 删除用户信息
    GETUSERLOGOUT(state){//不会接收参数数据
        state.userInfo={};
    }
};
const state={
    yanZhenCode:'',//代存服务器返回过来的验证码
    token:'',//存服务器返回过来数据【token字符串令牌】
    userInfo:{},//存放登陆后服务器返回的 用户信息
};
const getters={};
const RegisterOrLoginVc={
    namespaced:true,//开启命名空间
    actions,
    mutations,
    state,
    getters,
}
export default RegisterOrLoginVc;//导出注册组件小仓库