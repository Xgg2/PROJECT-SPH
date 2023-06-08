//tools文件就是放一些工具 uuid 正则..
import { v4 as uuidv4 } from 'uuid';
export function getuuId(){//页面一刷新就出来了
    localStorage.getItem('uuid') ? '' :localStorage.setItem('uuid',uuidv4());//这样就不会调用一次，id变一次了。
    // localStorage.setItem('uuid',uuidv4()) ;//在本地存储当中存一个id
    // if(!localStorage.getItem('uuid')){//如果本地存储当中没有，就生成一个
    //     localStorage.setItem('uuid',uuidv4());//刚开始的时候，没有，就生成一个（或者用户把本地存储清除了，就生成一个）
    // }
    return localStorage.getItem('uuid');//获取返回到函数调用处   （这里当用户把本地存储的id清除了以后，这里获取不到，就会返回一个空给小仓库state中的对象数据）  会拿最新的往里放（小仓库state中）
}