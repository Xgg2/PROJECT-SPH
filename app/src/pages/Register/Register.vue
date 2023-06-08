<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <router-link to="/login">登录</router-link>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input type="text" placeholder="请输入你的手机号" v-model:value="phone" @change="isphone()">
        <span class="error-msg" ref="errphone"></span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input type="text" placeholder="请输入验证码" v-model:value="code" @change="iscode()">
        <button class="btncode" @click="getCode($event)">{{btnCodeText}}</button>
        <span class="error-msg" ref="errcode"></span>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input type="text" placeholder="请输入你的登录密码" v-model:value="password" @change="ispassword()">
        <span class="error-msg" ref="errpassword"></span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input type="text" placeholder="请输入确认密码" v-model:value="password1" @change="ispassword1()">
        <span class="error-msg" ref="errpassword1"></span>
      </div>
      <div class="controls">
        <input name="m1" type="checkbox" :checked="agree" @click="agree=!agree">
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg" ref="errcheck"></span>
      </div>
      <div class="btn">
        <button @click="userRegister">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'Register',
  data() {
    return {
      phone: '',//初始一个内容，用户最终输入的表单数据流向data
      btnCodeText: '获取验证码',//btn文本内容
      code: '',//验证码输入框
      password: '',//密码
      password1: '',//确认密码
      agree: true,//用户是否同意协议 默认true同意，一上来就勾选上
      isallZ: false,//都验证成功 这个才是真
    }
  },
  methods: {
    async getCode(e) {//点击一次后将其变为disabled的30秒不能点击状态
      let reg = /^1[\d]{10}$/;//手机号长度校验
      if (reg.test(this.phone)) {
        try {
          // let {phone}=this ;//从组件实例身上解构赋值 手机号这个数据
          //手机号有了，不为空，就执行后面的联系actions请求并传入手机号
          // phone && (await this.$store.dispatch('RegisterVc/getYanZhenCode',this.phone));
          await this.$store.dispatch('RegisterOrLoginVc/getYanZhenCode', this.phone);//联系actions发请求，把电话传递给服务器
          this.code = this.yanZhenCode;//使用映射过来的数据
          e.target.disabled = true;//禁用
          e.target.style.cursor = 'not-allowed';
          let s = 10, timer = null;
          timer = setInterval(() => {
            this.btnCodeText = s;
            s--;
            if (s < 0) {
              e.target.disabled = false;//解除禁用
              this.btnCodeText = '获取验证码';
              e.target.style.cursor = 'pointer';
              clearInterval(timer);
            }
          }, 1000);//每一秒执行一次定时器中的函数
        } catch (err) {
          console.log(err)
        }
      }
      else {
        alert('手机号码有误')
      }

    },
    //注册按钮回调
    async userRegister() {
      if(this.isallZ){
      //解构实例身上收集的表单数据
      let {phone, code, password, password1} = this;
      //表单数据都不为空，就走后面，联系actions发请求传参数【表单用户注册数据】  对象属性属性值的简写形式传参 ，联系actions请求函数会返回一个成功或失败的promise对象
      try {
        (phone && code && password === password1) && await this.$store.dispatch('RegisterOrLoginVc/getUserRegister', {
          phone,
          code,
          password
        });//这里要传递参数
        //成功以后【服务器将表单用户注册数据存入数据库中】进行路由跳转到登陆页面
        this.$router.push({
          name: 'login'
        })
      } catch (err) {//请求传参给服务器失败【服务器没有把用户信息存入数据库中】，可能是用户电话已被注册
        alert('已登陆或出错');
      }
      }
      else {
        alert('用户信息不完善');
      }
    },
    //表单验证
    //用户手机号输入后的回调
    isphone() {
      //定义一个正则表达式
      let reg = /^1[\d]{10}$/;//手机号长度校验
      if (reg.test(this.phone)) {
        this.$refs.errphone.innerText = '';
        this.isallZ = true;//这里验证通过
      } else {
        this.isallZ = false;//验证不通过，点击注册按钮无效
        this.$refs.errphone.innerText = '手机号格式有误';
      }
    },
    //验证码
    iscode() {
      let reg = /^[\d]{6}$/;//验证码长度校验
      if (reg.test(this.code)) {
        this.$refs.errcode.innerText = '';
        this.isallZ = true;//这里验证通过
      } else {
        this.isallZ = false;//验证不通过，点击注册按钮无效
        this.$refs.errcode.innerText = '验证码格式有误';
      }
    },
    //密码验证
    ispassword() {
      let reg = /^[a-zA-Z]\w{8,16}$/;//密码长度校验
      if (reg.test(this.password)) {
        this.$refs.errpassword.innerText = '';
        this.isallZ = true;//这里验证通过
      } else {
        this.isallZ = false;//验证不通过，点击注册按钮无效
        this.$refs.errpassword.innerText = '密码格式有误包含数字与字母开头';
      }
    },
    //确认密码
    ispassword1() {
      let reg = /^[a-zA-Z]\w{8,16}$/;//密码长度校验
      if (reg.test(this.password1) && this.password === this.password1) {
        this.$refs.errpassword1.innerText = '';
        this.isallZ = true;//这里验证通过
      } else {
        this.isallZ = false;//验证不通过，点击注册按钮无效
        this.$refs.errpassword1.innerText = '确认密码包含以字母开头或者与密码不一致';
      }
    },
  },
  watch:{
    //监视agree的变化
    agree(newval,oldval){
      if(newval){
        this.isallZ=true;
        this.$refs.errcheck.innerText='';
      }
      else {
        this.isallZ=false;
        this.$refs.errcheck.innerText='请点击同意按钮';
      }
    }
  },
  computed:{
      ...mapState('RegisterOrLoginVc',['yanZhenCode']),//映射注册组件小仓库state中的数据
    }
  }
</script>

<style lang="less" scoped>
  .register-container {
    .register {
      width: 1200px;
      height: 445px;
      border: 1px solid rgb(223, 223, 223);
      margin: 0 auto;

      h3 {
        background: #ececec;
        margin: 0;
        padding: 6px 15px;
        color: #333;
        border-bottom: 1px solid #dfdfdf;
        font-size: 20.04px;
        line-height: 30.06px;

        span {
          font-size: 14px;
          float: right;

          a {
            color: #e1251b;
          }
        }
      }

      div:nth-of-type(1) {
        margin-top: 40px;
      }

      .content {
        padding-left: 390px;
        margin-bottom: 18px;
        position: relative;

        label {
          font-size: 14px;
          width: 96px;
          text-align: right;
          display: inline-block;
        }

        input {
          width: 270px;
          height: 38px;
          padding-left: 8px;
          box-sizing: border-box;
          margin-left: 5px;
          outline: none;
          border: 1px solid #999;
        }

        img {
          vertical-align: sub;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .controls {
        text-align: center;
        position: relative;

        input {
          vertical-align: middle;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .btn {
        text-align: center;
        line-height: 36px;
        margin: 17px 0 0 55px;

        button {
          outline: none;
          width: 270px;
          height: 36px;
          background: #e1251b;
          color: #fff !important;
          display: inline-block;
          font-size: 16px;
        }
      }
    }

    .copyright {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      line-height: 24px;

      ul {
        li {
          display: inline-block;
          border-right: 1px solid #e4e4e4;
          padding: 0 20px;
          margin: 15px 0;
        }
      }
    }
    .btncode{
      width: 80px;
      height: 38px;
      margin-left: 10px;

      .btncode:hover{
        cursor: pointer;
      }
    }

  }
</style>