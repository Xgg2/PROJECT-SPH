import axios from "axios";
//加载动画
import nprogress from "nprogress";
import 'nprogress/nprogress.css'
import Vue from "vue";

Vue.use(nprogress);
const mockReq = axios.create({
    baseURL: '/mock',//默认路径 对应的axios实例url就不用加了
    timeout: 5000,
});
//请求拦截器
mockReq.interceptors.request.use((config) => {
    nprogress.start();
    return config;
})
mockReq.interceptors.response.use((res) => {
    nprogress.done();
    return res.data;
}, (err) => {
    console.log(err)
})

export default mockReq;