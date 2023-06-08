<template>
  <div class="login-container">
    <!-- 登录 -->
    <div class="login-wrap">
      <div class="login">
        <div class="loginform">
          <ul class="tab clearFix">
            <li>
              <a style="border-right: 0;">扫描登录</a>
            </li>
            <li>
              <a class="current">账户登录</a>
            </li>
          </ul>

          <div class="content">
            <form>
              <div class="input-text clearFix">
                <span></span>
                <input type="text" placeholder="邮箱/用户名/手机号" v-model:value="phone">
              </div>
              <div class="input-text clearFix">
                <span class="pwd"></span>
                <input type="password" placeholder="请输入密码" v-model:value="password">
              </div>
              <div class="setting clearFix">
                <label class="checkbox inline">
                  <input name="m1" type="checkbox" value="2" checked="">
                  自动登录
                </label>
                <span class="forget">忘记密码？</span>
              </div>
                          <!--阻止默认行为-->
              <button class="btn" @click.prevent="isLogin">登&nbsp;&nbsp;录</button>
            </form>

            <div class="call clearFix">
              <ul>
                <li><img src="./images/qq.png" alt=""></li>
                <li><img src="./images/sina.png" alt=""></li>
                <li><img src="./images/ali.png" alt=""></li>
                <li><img src="./images/weixin.png" alt=""></li>
              </ul>
              <router-link class="register" to="/register">立即注册</router-link>
            </div>
          </div>
        </div>
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
    name: 'Login',
    data(){
      return {
        phone:'12300000000',//设置一个默认的登录手机号码【老师的】  我们的账号12345678123 密码123123购物商品清单接口可以拿到数据了。
        password:'111111',
      }
    },
    methods:{
      //登陆的回调
      async isLogin(){
        let {phone,password}=this;//解构赋值
        //前面两个都有就走后面，联系actions发请求，并把用户登录表单数据传给服务器
        try{
          //用户未登录，点击要到的地方【个人中心】，会先跳到登陆页面让用户登陆【之后跳到用户要去的地方】问题：要点击两次登陆
          (phone && password) && await this.$store.dispatch('RegisterOrLoginVc/getUserLogin',{phone,password})//这里传递的参数要与接口文档中的参数名一致
          localStorage.setItem('token',this.token);//存在本地储存当中【注意存入的时机，可以写在actions中】
          //登录成功进行路由跳转 【成功得到服务器返回的token】
         let toPath=this.$route.query.wanto || '/home';//如果有用户要to的路由地址，就跳到用户要去的地方【用户未登陆点击一个要去的地方】，没有就默认跳转到home首页
              this.$router.push({
                path:toPath,
              });
          console.log('未获得用户信息，被全局路由守卫拦截')

          console.log('@已存入token')
        }
        catch(err) {
            alert(err.message);
        }
      }
    },
    computed:{
      ...mapState('RegisterOrLoginVc',['token'])
    },
    //组件内路由守卫   用户已登录时，就不让他再次进入登录界面了
    // beforeRouteEnter(to,from,next){
    //   if (localStorage.getItem('token')){//有token
    //     next(false);//如果用户已登陆，用户在url地址中输入login跳转，会阻断跳转 【没有登录的时候本地存储中没有token，就可以进入login组件】
    //     // console.log(to,from,next);
    //   }
    // }


  }
</script>

<style lang="less" scoped>
  .login-container {
    .login-wrap {
      height: 487px;
      background-color: #e93854;

      .login {
        width: 1200px;
        height: 487px;
        margin: 0 auto;
        background: url(./images/loginbg.png) no-repeat;
      }

      .loginform {
        width: 420px;
        height: 406px;
        box-sizing: border-box;
        background: #fff;
        float: right;
        top: 45px;
        position: relative;
        padding: 20px;

        .tab {

          li {
            width: 50%;
            float: left;
            text-align: center;

            a {
              width: 100%;
              display: block;
              height: 50px;
              line-height: 50px;
              font-size: 20px;
              font-weight: 700;
              color: #333;
              border: 1px solid #ddd;
              box-sizing: border-box;
              text-decoration: none;

            }

            .current {
              border-bottom: none;
              border-top-color: #28a3ef;
              color: #e1251b;
            }
          }
        }

        .content {
          width: 380px;
          height: 316px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-top: none;
          padding: 18px;

          form {
            margin: 15px 0 18px 0;
            font-size: 12px;
            line-height: 18px;

            .input-text {
              margin-bottom: 16px;

              span {
                float: left;
                width: 37px;
                height: 32px;
                border: 1px solid #ccc;
                background: url(./images/icons.png) no-repeat -10px -201px;
                box-sizing: border-box;
                border-radius: 2px 0 0 2px;
              }

              .pwd {
                background-position: -72px -201px;
              }

              input {
                width: 302px;
                height: 32px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-left: none;
                float: left;
                padding-top: 6px;
                padding-bottom: 6px;
                font-size: 14px;
                line-height: 22px;
                padding-right: 8px;
                padding-left: 8px;

                border-radius: 0 2px 2px 0;
                outline: none;
              }
            }

            .setting {
              label {
                float: left;
              }

              .forget {
                float: right;
              }
            }

            .btn {
              background-color: #e1251b;
              padding: 6px;
              border-radius: 0;
              font-size: 16px;
              font-family: 微软雅黑;
              word-spacing: 4px;
              border: 1px solid #e1251b;
              color: #fff;
              width: 100%;
              height: 36px;
              margin-top: 25px;
              outline: none;
            }
          }

          .call {
            margin-top: 30px;

            ul {
              float: left;

              li {
                float: left;
                margin-right: 5px;
              }
            }

            .register {
              float: right;
              font-size: 15px;
              line-height: 38px;
            }

            .register:hover {
              color: #4cb9fc;
              text-decoration: none;
            }
          }

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

  }
</style>