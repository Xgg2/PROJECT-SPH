//模拟数据
// const Mock=require('mockjs');
import Mock from 'mockjs'
//json 文件默认暴露
import banner from './banner.json';
import floors from "./floors.json";
import addressinfo from './addressinfo.json'
//第一个参数请求的地址，第二个参数：请求的数据
//mock就是模拟发送请求发送，但是数据就在我能们这里  模拟请求过来的数据
//可以把他当作一个虚假的服务器，发送请求的路径，返回的数据
Mock.mock("/mock/banner",{code:200,data:banner});
Mock.mock('/mock/floors',{code:200,data:floors});
Mock.mock("/mock/addressinfo",{code:200,data:addressinfo});//用户收货地址信息数据