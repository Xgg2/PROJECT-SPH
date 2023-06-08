import axios from "axios";
//引入进度条插件
import nprogress from 'nprogress';//其身上有很多属性和方法,start()方法表示进度条开始,done()方法表示进度条结束
import 'nprogress/nprogress.css';//引入进度条样式
import Vue from "vue";
import DetailVc from "@/store/Detail/Detail";//为了拿uuid，放在请求头上
Vue.use(nprogress);
//创建axios实例
const  axs =axios.create({
    //配置基础路径，发送请求时会在路径上自动加上/api
    baseURL:'/api',
    timeout:5000,//设置请求超时时间，过了这个时间就请求失败
});
//axios.interceptors.request.use() 用于向 Axios 实例中添加一个请求拦截器。这个拦截器将在发送请求前被调用，可以在其中进行一些操作，例如添加请求头、修改请求参数等。
//配置请求的拦截器，在请求发送之前会被调用，主要设置请求头等（给实例添加）
axs.interceptors.request.use((config)=>{
    nprogress.start();//进度条开始动,就是请求拦截器捕获到请求的时候
    config.headers.userTempId=DetailVc.state.uuid;//也可以在本地储存中拿这个uuid
    if(localStorage.getItem('token')){
        config.headers.token=localStorage.getItem('token');//如果本地储存有token令牌字符串 ，就放到请求头中带给服务器，用于验证用户身份。
    }
    return config;

});
axs.interceptors.response.use((res)=>{
    //响应成功的回调：服务器相应的数据回来以后，响应拦截器可以监测到，做一些事情
    nprogress.done();//进度条结束,服务器响应成功
    return res.data;
},(err)=>{
    //响应失败的回调
    return Promise.reject(new Error('Faile'));
    //new Error('faile')
    // Error: faile
    //     at <anonymous>:1:1

})
// console.log(nprogress)
export default axs;