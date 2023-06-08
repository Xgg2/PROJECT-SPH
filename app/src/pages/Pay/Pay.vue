<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时</em>之内完成支付，超时订单会自动取消。订单号：<em>{{$route.query.dingdanId}}</em></span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{payInfo.totalFee}}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">支付宝</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请保存以下支付宝信息。</li>
        </ol>
        <h4>支付宝账户信息：（很重要，<span class="save">请保存！！！</span>）</h4>
        <ul>
          <li>支付帐号：11111111</li>
          <li>密码：111111</li>
          <li>支付密码：111111</li>
        </ul>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li><img src="./images/pay2.jpg"></li>
            <li><img src="./images/pay3.jpg"></li>
          </ul>

        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg"></li>
              <li><img src="./images/pay11.jpg"></li>
              <li><img src="./images/pay12.jpg"></li>
              <li><img src="./images/pay13.jpg"></li>
              <li><img src="./images/pay14.jpg"></li>
              <li><img src="./images/pay15.jpg"></li>
              <li><img src="./images/pay16.jpg"></li>
              <li><img src="./images/pay17.jpg"></li>
              <li><img src="./images/pay18.jpg"></li>
              <li><img src="./images/pay19.jpg"></li>
              <li><img src="./images/pay20.jpg"></li>
              <li><img src="./images/pay21.jpg"></li>
              <li><img src="./images/pay22.jpg"></li>

            </ul>
          </div>

        </div>
        <div class="hr"></div>

        <div class="submit">
<!--          <router-link class="btn" to="/paysuccess">立即支付</router-link>-->
          <el-button type="text" class="btn" @click="open">立即支付</el-button>
        </div>
        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span><a href="weixinpay.html" target="_blank">微信支付</a></span>
            <span>中国银联</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRcode from 'qrcode';
  export default {
    name: 'Pay',
    data(){
      return{
        payInfo:{},//请求返回的数据为对象形式，在这里初始为一个空对象
        timer:null,//待存定时器
        paystatusCode:'',//待存支付成功状态码200 ，以后点击我已支付按钮的时候，根据这个是否为200，判断用户是否支付成功，【路由跳转】
      }
    },
    methods:{
      async getPayOrder(){//mounted钩子函数尽量不适用async 与await，所以我们在methods中把请求放在一个函数中。
        let response=await this.$Api.reqOrderInfo(this.$route.query.dingdanId);//这里我么请求支付页的数据【生成支付二维码的字符串，总金额】，拿着点击提交订单时路由跳转传参过来的订单号【发给服务器】。
       if(response.code===200){
         // console.log(response);
         //成功的话 将服务器返回的数据存起来
          this.payInfo=response.data;
       }
      },
      async open() {
        let qrCodeurl=await QRcode.toDataURL(this.payInfo.codeUrl);//返回一个带有状态的promise对象  【带有二维码】，把二维码，发到弹出框中
        this.$alert(`<img src=${qrCodeurl} alt=""/>`, '微信支付', {
          dangerouslyUseHTMLString: true,
          center:true,//对应组件都有相关的配置项
          showCancelButton:true,//显示取消按钮
          cancelButtonText:'提交问题',//取消的文本
          confirmButtonText:'支付成功',//确定按钮文本
          showClose:false,//隐藏关闭按钮
          beforeClose:(type,elVc,done)=>{
            // type :cancel用户点击支付遇到问题 ，  confirm用户点击我已支付
            //elVc:element-ui这个弹框组件
            //done() :关闭弹窗
            if(type==='cancel'){//用户点击支付遇到问题
              alert('请联系后台管理员老师');//提示用户
              clearInterval(this.timer);//清除定时器【停止发请求】
              this.timer=null;
              done();//关闭弹窗
            }
            //状态码不为200【用户不支付成功】，不会执行后面的
            else if(type==='confirm' && this.paystatusCode===200){//用户点击我已支付 ，根据状态码判断用户是否支付【状态码不是200，点击按钮 无效】

              clearInterval(this.timer);
              this.timer=null;
              done();//关闭弹窗
              this.$router.push({name:'paysuccess'});
            }
          }
        });
        //弹窗弹出以后，要知道用户的支付状态  ，服务器知道，所以就要不断发请求 询问服务器用户支付状态
        //因为要不断向服务器询问 支付状态 使用定时器
        this.timer=setInterval(async ()=>{
          let response=await this.$Api.reqPayStatus(this.$route.query.dingdanId);//返回带有状态带有数据的promise对象【在这里服务器不会返回数据】
          // console.log(response);//打印请求服务器返回的支付状态
          if(response.code===200){//状态码为200表示支付成功
              //清除定时器 不在发请求
            clearInterval(this.timer);
            this.timer=null;
            //把状态码200存起来
            this.paystatusCode=200;
            //隐藏弹窗
            this.$msgbox.close();
            //路由跳转
            this.$router.push({name:'paysuccess'})

          }
        },1000);

      }

    },
    mounted() {//在声明周期钩子函数上尽量不要使用async与await
      this.getPayOrder();
      console.log(this.$bus.__proto__);//指向Vue.prototype身上有$emit和$on方法
    },

  }
</script>

<style lang="less" scoped>
  .pay-main {
    margin-bottom: 20px;

    .pay-container {
      margin: 0 auto;
      width: 1200px;

      a:hover {
        color: #4cb9fc;
      }

      .orange {
        color: #e1251b;
      }

      .money {
        font-size: 18px;
      }

      .zfb {
        color: #e1251b;
        font-weight: 700;
      }

      .checkout-tit {
        padding: 10px;

        .tit-txt {
          font-size: 14px;
          line-height: 21px;

          .success-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url(./images/icon.png) no-repeat 0 0;
          }

          .success-info {
            padding: 0 8px;
            line-height: 30px;
            vertical-align: top;
          }
        }

        .paymark {
          overflow: hidden;
          line-height: 26px;
          text-indent: 38px;

          .fl {
            float: left;
          }

          .fr {
            float: right;

            .lead {
              margin-bottom: 18px;
              font-size: 15px;
              font-weight: 400;
              line-height: 22.5px;
            }
          }
        }
      }

      .checkout-info {
        padding-left: 25px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        border: 2px solid #e1251b;

        h4 {
          margin: 9px 0;
          font-size: 14px;
          line-height: 21px;
          color: #e1251b;
        }

        ol {
          padding-left: 25px;
          list-style-type: decimal;
          line-height: 24px;
          font-size: 14px;
        }

        ul {
          padding-left: 25px;
          list-style-type: disc;
          line-height: 24px;
          font-size: 14px;
        }
      }

      .checkout-steps {
        border: 1px solid #ddd;
        padding: 25px;

        .hr {
          height: 1px;
          background-color: #ddd;
        }

        .step-tit {
          line-height: 36px;
          margin: 15px 0;
        }

        .step-cont {
          margin: 0 10px 12px 20px;

          ul {
            font-size: 0;

            li {
              margin: 2px;
              display: inline-block;
              padding: 5px 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              line-height: 18px;
            }
          }
        }
      }

      .submit {
        text-align: center;

        .btn {
          display: inline-block;
          padding: 15px 45px;
          margin: 15px 0 10px;
          font: 18px "微软雅黑";
          font-weight: 700;
          border-radius: 0;
          background-color: #e1251b;
          border: 1px solid #e1251b;
          color: #fff;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }
      }
    }
  }
</style>