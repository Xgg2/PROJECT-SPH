<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <div class="address clearFix" v-for="a of addressinfo" :key="a.id">
        <span class="username" :class="{selected:a.isDefault===1}">{{a.name}}</span>
        <!--传一个当前点击的地址，以及整个数据数组-->
        <p @click="isDefaultAddress(a,addressinfo)">
          <span class="s1">{{a.address}}</span>
          <span class="s2">{{a.tel}}</span>
          <span class="s3" v-show="a.isDefault===1">默认地址</span>
        </p>
      </div>
      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left:5px;">货到付款</span>

      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul class="list clearFix" v-for="t of userDetailArrayList" :key="t.sourceId">
          <li>
            <img :src="t.imgUrl" alt="" style="width: 100px;height: 100px;">
          </li>
          <li>
            <p>{{t.skuName}}</p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{t.orderPrice}}</h3>
          </li>
          <li>X{{t.skuNum}}</li>
          <li>有货</li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea placeholder="建议留言前先与商家沟通确认" class="remarks-cont" v-model="usertextarea"></textarea>

      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b><i>{{tradeinfo.totalNum}}</i>件商品，总商品金额</b>
          <span>¥{{tradeinfo.totalAmount}}.00</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{tradeinfo.totalAmount}}.00</span></div>
      <!--这里拿着isDefault为1的用户收货地址对象展示-->
      <div class="receiveInfo">
        寄送至:
        <span>{{defaultAddress.address}}</span>
        收货人：<span>{{ defaultAddress.name }}</span>
        <span>{{defaultAddress.tel}}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <!--不让他直接路由跳转，等请求成功，返回货号再路由跳转的支付界面-->
<!--      <router-link class="subBtn" to="/pay">提交订单</router-link>-->
      <span class="subBtn" @click="submitOrder" style="cursor: pointer">提交订单</span>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

  export default {
    name: 'Trade',
    data(){
      return{
        usertextarea:'',//收集买家留言
        dingdanId: '',//初始值为空
      }
    },
    mounted() {
      this.$store.dispatch('TradeVc/getMockAddressInfo');
      this.$store.dispatch('TradeVc/getUserTrade');//要带上token字段请求头
    },
    computed:{
      ...mapState('TradeVc',['addressinfo']),//映射用户收货地址数据
      //计算出当前的默认收货地址
      defaultAddress(){
         return this.addressinfo.find(item=>{
          return item.isDefault===1;//等于1，就是默认的地址，最下面展示这个 ，会返回满足条件的数组元素【数组的形式返回】 ，可以用find()
        }) || {};//默认返回一个空对象
      },
      ...mapState('TradeVc',['tradeinfo']),//用户商品清单数据
      ...mapGetters('TradeVc',['userDetailArrayList']),//简化用户购物清单数据
      //计算应付金额
      // shouldPrice(){
      //   return this.userDetailArrayList.reduce((prev,val)=>{//没有初始值，prev就是第一个数组元素，val就是第二个数组元素
      //     return prev.orderPrice+val.orderPrice;//每一次循环的prev就是上一次的prev+val
      //   });
      // }
    },
    methods:{
      //修改默认收货地址
      isDefaultAddress(a,addressinfo){
        addressinfo.forEach(item=>{
          item.isDefault=0;//先排掉所有
        });
        a.isDefault=1;//只让点击的为1 这里修改了默认的值，使选中框变为当前点击的元素 以及默认地址元素的显示
      },
      //用户提交订单
      async submitOrder(){
        let {tradeNo} =this.tradeinfo;//解构对象对应属性 订单编号
        let data={ //这里属性所对应的属性值要一一对应，不要这个属性值到那个属性身上了
          consignee: this.defaultAddress.name,//根据计算出来的默认收货地址
          consigneeTel: this.defaultAddress.tel,
          deliveryAddress:this.defaultAddress.address,
           paymentWay: "ONLINE",//支付方式 ONLINE代表在线支付
           orderComment: this.usertextarea,//data中收集的用户留言
          orderDetailList:this.userDetailArrayList,//我们在getters中简化出来的用户购物清单数组【根据请求返回过来的对象】
        }
        //这里要带上参数  【订到编号】【用户名，电话，地址，支付方式，留言，购物请求的数组】 请求头要有token
        let response=await this.$Api.reqSubmitOrder(tradeNo,data);//这里会返回一个带有状态 带有数据的promise对象。
        // console.log(response);//这里请求成功，服务器只会返回一个订单号【路由跳转】，传递给Pay组件用于请求【传参给服务器】得到Pay路由组件页面的总金额以及生成支付二维码的字符串
        if(response.code===200){//如果请求成功【订单编号】【用户订单信息】服务器收到，并返回订单号
          //先将成功后服务器返回的订单号【存起来】。
          this.dingdanId=response.data;
            //成功进行路由跳转【到支付界面】 编程式路由导航  并传参
          this.$router.push({
            name:'pay',
            query:{dingdanId:this.dingdanId}
          })
        }
        else{
          //返回状态码不是200
          alert(response.message);
        }
      }
    }

  }
</script>

<style lang="less" scoped>
  .trade-container {
    .title {
      width: 1200px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 21px;
    }

    .content {
      width: 1200px;
      margin: 10px auto 0;
      border: 1px solid rgb(221, 221, 221);
      padding: 25px;
      box-sizing: border-box;

      .receive,
      .pay {
        line-height: 36px;
        margin: 18px 0;
      }

      .address {
        padding-left: 20px;
        margin-bottom: 15px;

        .username {
          float: left;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          position: relative;
        }

        .username::after {
          content: "";
          display: none;
          width: 13px;
          height: 13px;
          position: absolute;
          right: 0;
          bottom: 0;
          background: url(./images/choosed.png) no-repeat;
        }

        .username.selected {
          border-color: #e1251b;
        }

        .username.selected::after {
          display: block;
        }

        p {
          width: 610px;
          float: left;
          line-height: 30px;
          margin-left: 10px;
          padding-left: 5px;
          cursor: pointer;

          .s1 {
            float: left;

          }

          .s2 {
            float: left;
            margin: 0 5px;
          }

          .s3 {
            float: left;
            width: 56px;
            height: 24px;
            line-height: 24px;
            margin-left: 10px;
            background-color: #878787;
            color: #fff;
            margin-top: 3px;
            text-align: center;
          }
        }

        p:hover {
          background-color: #ddd;
        }
      }

      .line {
        height: 1px;
        background-color: #ddd;
      }

      .way {
        width: 1080px;
        height: 110px;
        background: #f4f4f4;
        padding: 15px;
        margin: 0 auto;

        h5 {
          line-height: 50px;
        }

        .info {
          margin-top: 20px;

          .s1 {
            float: left;
            border: 1px solid #ddd;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
          }

          p {
            line-height: 30px;
          }
        }
      }

      .detail {
        width: 1080px;

        background: #feedef;
        padding: 15px;
        margin: 2px auto 0;

        h5 {
          line-height: 50px;
        }

        .list {
          display: flex;
          justify-content: space-between;

          li {
            line-height: 30px;

            p {

              margin-bottom: 20px;
            }

            h4 {
              color: #c81623;
              font-weight: 400;
            }

            h3 {

              color: #e12228;
            }
          }
        }
      }

      .bbs {
        margin-bottom: 15px;

        h5 {
          line-height: 50px;
        }

        textarea {
          width: 100%;
          border-color: #e4e2e2;
          line-height: 1.8;
          outline: none;
          resize: none;
        }
      }

      .bill {
        h5 {
          line-height: 50px;
        }

        div {
          padding-left: 15px;
        }
      }
    }

    .money {
      width: 1200px;
      margin: 20px auto;

      ul {
        width: 220px;
        float: right;

        li {
          line-height: 30px;
          display: flex;
          justify-content: space-between;

          i {
            color: red;
          }
        }
      }
    }

    .trade {
      box-sizing: border-box;
      width: 1200px;
      padding: 10px;
      margin: 10px auto;
      text-align: right;
      background-color: #f4f4f4;
      border: 1px solid #ddd;

      div {
        line-height: 30px;
      }

      .price span {
        color: #e12228;
        font-weight: 700;
        font-size: 14px;
      }

      .receiveInfo {
        color: #999;
      }
    }

    .sub {
      width: 1200px;
      margin: 0 auto 10px;

      .subBtn {
        float: right;
        width: 164px;
        height: 56px;
        font: 700 18px "微软雅黑";
        line-height: 56px;
        text-align: center;
        color: #fff;
        background-color: #e1251b;

      }
    }

  }
</style>