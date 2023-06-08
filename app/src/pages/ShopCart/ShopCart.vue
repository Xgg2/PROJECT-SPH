<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <!--就比如数据还没有来，读取数组第一项为undefined ，undefined.cartInfoList就找不到 就会报错-->
        <ul class="cart-list" v-for="c of cartInfoList" >

          <li class="cart-list-con1">
            <!--取反操作，点击的时候是1就让他变成0，反之-->
            <input type="checkbox" name="chk_list" :checked="c.isChecked===1" @change="changeIschecked(c,$event)">
          </li>
          <li class="cart-list-con2">
            <img :src="c.imgUrl">
            <div class="item-msg">{{c.skuName}}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{c.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="jianSkuNum(c)">-</a>
            <input autocomplete="off" type="text" :value="c.skuNum" minnum="1" class="itxt" ref="changeIpt" @change="iptChange($event,c)" style="outline: none">
            <a href="javascript:void(0)" class="plus" @click="addSkuNum(c)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{c.skuNum*c.skuPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <!--删除按钮 传递一个要删除的商品对象给回调-->
            <a class="sindelet" @click="removeShop(c)" style="cursor: pointer">删除</a>
            <br>
            <a href="#">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">                         <!--当购物车没有商品时，改为取消选中--><!--全选按钮选中的两个条件：1.所有商品都是选中状态2.且购物车商品数大于0-->
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @click="allChecked($event)">
        <span>全选</span>
      </div>
      <div class="option">
        <!---->
        <a @click="removeIsCheckAllShop" style="cursor: pointer">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
<!--        <span style="font-family: 楷体">{{CartLists_0.createTime}}</span>-->
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <!--这里需要统计一下，isChecked为1的个数 ，使用计算属性-->
          <span>{{skuIsCheckedNum.length}}</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{addPriceSum}}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState,mapGetters} from "vuex";
import  throttle from 'lodash/throttle';//引入节流函数
export default {
    name: 'ShopCart',
    mounted() {
      this.getShopCartData();
    },
    methods:{
      getShopCartData(){//联系actions请求 要用很多次 我们封装成一个函数
        // console.log('@调用getShopCartData')
        this.$store.dispatch('ShopCartVc/getCartList');
      },
      addSkuNum:throttle(function(c){ //不能使用箭头函数 否则this指向会遵循lodash函数中的上下文
        // console.log(this);//组件vc
        c.skuNum++
          this.addorupdatashop(c.skuId,1);//发请求 传递数据
        //调用shopcart组件的联系actions请求的函数
        // this.getShopCartData(); //不使用这个 在每次触发回调 虽然页面展示的数据是对的，但是不是拿的服务器最新的数据
      },1600),
      jianSkuNum(c){
        c.skuNum--
      if(c.skuNum<0){//不能小于-1
        c.skuNum=0;
      }
      else{//点击减按钮 数量大于或等于0才可以发请求。
        this.addorupdatashop(c.skuId,-1);//发请求 传递数据  注意这里不能直接传递当前的总数量，要传每次加或减的个数
      }
        // this.getShopCartData();//拿服务器更新数据后的 最新的数据
      },
      iptChange(e,c){
        //获取用户输入的内容
          let iptText=e.target.value;
          //判断内容是否符合规范
        let reg=/^[\d]+$/; //还有一个条件 ，不能以0开头 【0.1这种的已经 '.'就已经不合法了】
        if(reg.test(iptText)){//如果满足条件  合法
          //这里我们先拿之前的数据【先不改数据】拿到之前的数量，也拿到当前输入的数量，就可以计算出增加的或减少的个数,然后春娣给服务器
          this.addorupdatashop(c.skuId,parseInt(iptText)-c.skuNum);//正的就是加的值，负的就是减的值
          c.skuNum=parseInt(iptText);//修改数据
          // this.getShopCartData()
        }
        else{
          alert('非法字符');
        }
      },
      //拿一个detail组件的联系actions的接口函数 传递id 与 数量
      addorupdatashop(id,num){
        this.$store.dispatch('DetailVc/addorupdateshopcart',{skuId:id,skuNum:num});//使用的时候传递进去
      },
      //因为修改商品是否选中需要多次联系actions对应函数发请求，我们把dispatch联系actions发请求（传参），封装成一个函数，提高复用
      // getShopisChecked(id,cheched){//调用的时候传id 与选中状态
      //   this.$store.dispatch('ShopCartVc/getShopCartisChecked',{skuId:id,isChecked:cheched})
      // },
      //改变商品选中状态
      async changeIschecked(c,e){
        let isCheck=e.target.checked ? 1 : 0;//事件对象的对应触发事件的元素的checked属性是一个布尔值 【根据布尔值为真就是1 否则就是0】
        console.log(isCheck); //点击后当前的选中状态传递给服务器
        try {
          // await this.getShopisChecked(c.skuId,c.isChecked===1 ? 0 : 1);//发请求 传递选中状态给服务器，【数据库记录一下】 这样放在函数当中捕获不到错误
          await this.$store.dispatch('ShopCartVc/getShopCartisChecked',{skuId:c.skuId,isChecked:isCheck})
          this.getShopCartData();//拿服务器返回的最新的数据
        }
        catch (err){
          alert('状态发送服务器错误');
        }
        // c.isChecked=c.isChecked===1 ? 0 : 1;//修改数据流控制页面变化，
      },
      //全选按钮
      async allChecked(e){
        // //让所有的商品isChecked为1
        // this.cartInfoList.map(item=>{
        //   return item.isChecked=item.isChecked===1 ? 0 : 1;
        //   //在这里也要发请求 传递所有商品的id ，以及选中状态
        // })
        // let allisCheck=e.target.checked ? 1 : 0;//第二种方法 根据状态改全部
        try {
          await this.$store.dispatch('ShopCartVc/isCheckedAllShop',e.target.checked)
          this.getShopCartData()
        }
        catch(err) {
          console.log(err.message)
        }
        // console.log(e.target.checked)

      },
      //删除购物车商品 需要发请求给服务器 传递参数 服务器处理修改数据库数据
      async removeShop(c){
        try {
          await  this.$store.dispatch('ShopCartVc/getRemoveShop',c.skuId);//后面传一个购物车要删除商品的id，到actions对应函数，会传给api对应返回axios实例的函数，对吼传到axios实例url路径参数身上
          //等待出结果成功以后，发请求，拿最新数据
          this.getShopCartData();//上面操作成功 【发请求 把要删除的商品id传递给服务器，数据库操作，成功以后】，发请求，拿最新的数据
        }
         catch(err) {
              alert('删除失败')
         }
          // this.cartInfoList.splice(this.cartInfoList.indexOf(c),1);//删除对应购物车商品  这样没有拿服务器服务器返回的最新的数据

      },
     //删除先中的全部商品
        async removeIsCheckAllShop() {
        try {
          //联系actions函数请求，函数返回promise对象
          await this.$store.dispatch('ShopCartVc/deleteAllIsCheckShop');//联系actions对应函数 发请求
          this.getShopCartData();//拿最新的数据
        }
        catch(err) {
          alert(err.message)
        }
         //要知道当前选中的商品
         //   let allIscheckShop=this.cartInfoList.filter(item=>{
         //     return item.isChecked===1;//满足条件
         //   })
         //   console.log(allIscheckShop );//当前选中商品数组中的每个对象
         //     Promise.all([allIscheckShop.forEach(shop=>{//shop是每一个当前选中的商品对象
         //        new Promise((resolve, reject)=>{
         //          this.$store.dispatch('ShopCartVc/getRemoveShop',shop.skuId);//联系actions发请求，把删除的商品id传递给服务器
         //         resolve();
         //       })
         //     })]).then(()=>{
         //      this.getShopCartData();//等待全部都产地给服务器后，拿最新的数据
         //     });

       }
      },
  computed:{
      ...mapState('ShopCartVc',['CartLists']),//映射小仓库中state、中的数据
      ...mapGetters('ShopCartVc',['CartList_0']),//小仓库计算出来的商品数据（处理了请求数据）
    //把小仓库对数据计算【简化】的属性【数据】，拿货来接着计算【处理】
    cartInfoList(){//拿着这里处理的数据进行渲染
        return this.CartList_0.cartInfoList || [] ;  //this.CartList_0.cartInfoList就是一个数组 ，请求数据没回来就是undefined，走后面，默认给一个空数组
    },
    //计算商品总价
    addPriceSum(){
        let sum=0;
        this.cartInfoList.forEach(item=>{
          sum+=item.skuNum*item.skuPrice;//item就是每一个商品 ，每一个商品的数量乘价格【】单价的和 就是总价
        })
      return sum;
    },
    //判断商品是否选中 【决定全选按钮的选中状态】
    isAllChecked(){   //数组方法every() ，所有元素满足条件返回true，有一个元素不满足条件 就返回false
        //在这里我们返回到使用处
        return this.cartInfoList.every(item=>{
          return item.isChecked===1 ;//等于1就是选中状态，都满足这个条件 就返回true ，有一个不满足就是false
        })
    },
    //计算购物车商品选中个数 【isChecked为1的个数】
    skuIsCheckedNum(){
        return this.cartInfoList.filter(item=>{//返回满足条件的数组元素
          return item.isChecked===1;//满足条件的是isChecked等于1的
        })
    }
  }

  }
</script>

<style lang="less" scoped>
  .cart {
    width: 1200px;
    margin: 0 auto;

    h4 {
      margin: 9px 0;
      font-size: 14px;
      line-height: 21px;
    }

    .cart-main {
      .cart-th {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 10px;
        overflow: hidden;

        &>div {
          float: left;
        }

        .cart-th1 {
          width: 25%;

          input {
            vertical-align: middle;
          }

          span {
            vertical-align: middle;
          }
        }

        .cart-th2 {
          width: 25%;
        }

        .cart-th3,
        .cart-th4,
        .cart-th5,
        .cart-th6 {
          width: 12.5%;

        }
      }

      .cart-body {
        margin: 15px 0;
        border: 1px solid #ddd;

        .cart-list {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          overflow: hidden;

          &>li {
            float: left;
          }

          .cart-list-con1 {
            width: 15%;
          }

          .cart-list-con2 {
            width: 35%;

            img {
              width: 82px;
              height: 82px;
              float: left;
            }

            .item-msg {
              float: left;
              width: 150px;
              margin: 0 10px;
              line-height: 18px;
            }
          }



          .cart-list-con4 {
            width: 10%;

          }

          .cart-list-con5 {
            width: 17%;

            .mins {
              border: 1px solid #ddd;
              border-right: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }

            input {
              border: 1px solid #ddd;
              width: 40px;
              height: 33px;
              float: left;
              text-align: center;
              font-size: 14px;
            }

            .plus {
              border: 1px solid #ddd;
              border-left: 0;
              float: left;
              color: #666;
              width: 6px;
              text-align: center;
              padding: 8px;
            }
          }

          .cart-list-con6 {
            width: 10%;

            .sum {
              font-size: 16px;
            }
          }

          .cart-list-con7 {
            width: 13%;

            a {
              color: #666;
            }
          }
        }
      }
    }

    .cart-tool {
      overflow: hidden;
      border: 1px solid #ddd;

      .select-all {
        padding: 10px;
        overflow: hidden;
        float: left;

        span {
          vertical-align: middle;
        }

        input {
          vertical-align: middle;
        }
      }

      .option {
        padding: 10px;
        overflow: hidden;
        float: left;

        a {
          float: left;
          padding: 0 10px;
          color: #666;
        }
      }

      .money-box {
        float: right;

        .chosed {
          line-height: 26px;
          float: left;
          padding: 0 10px;
        }

        .sumprice {
          width: 200px;
          line-height: 22px;
          float: left;
          padding: 0 10px;

          .summoney {
            color: #c81623;
            font-size: 16px;
          }
        }

        .sumbtn {
          float: right;

          a {
            display: block;
            position: relative;
            width: 96px;
            height: 52px;
            line-height: 52px;
            color: #fff;
            text-align: center;
            font-size: 18px;
            font-family: "Microsoft YaHei";
            background: #e1251b;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>