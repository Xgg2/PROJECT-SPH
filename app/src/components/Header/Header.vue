<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!--有了就是true ，取个反，隐藏登录与注册按钮-->
          <p v-if="!userName">
            <!--   声明式路由导航 ，务必有to属性-->
            <!--有token字符串了【本地储存当中】，表示用户一定点击登陆按钮，并且登陆成功了，这里就不用显示出来的-->
            <router-link to="/login">登录</router-link>
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <p v-else>
            <a>{{userName}}</a>
            <a class="register" @click="loginLeave" style="cursor: pointer">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" title="尚品汇" to="/home" target="_parent">
          <img src="./images/logo.png" alt="">
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="" class="searchForm">
                                                                        <!--v-model双向绑定，数据流向页面，页面表单元素流向data          -->
          <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model:value="keyword" @keydown.enter="gosearch"/>
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="gosearch">搜索</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>

export default {
  name: "Header",
  data(){
    return{
      keyword:'',
    }
  },
  methods:{
    gosearch(){
      //合并路由参数 TypeNav组件和Header组件传递给Search组件的参数合并 （就是我不仅传我的参数（params）给Search组件，如果有其他组件也要传递参数给Search，我就给它带上）
      let local={name:'search',params:{keyword:this.keyword || undefined}};
      if(this.$route.query){//在点击搜索按钮 跳转路由的时候 （传递params参数的时候）如果之前先点击三级列表跳转传参的话（query参数），$route中就会有query参数，我们就把query参数拿过来一起传递给Search组件
        local.query=this.$route.query;
      }
      // this.keyword='';
      this.$router.push(local,()=>{})
      //编程式路由导航
      // this.$router.push({
      //   // path:'/search',//路由传参（对象写法）path可以和params一起使用?//注意path这种写法，不能够和params传参形式一起使用（会报错）
      //   name:'search',
      //   // query:{//传递query参数  /?a=1&b=2
      //   //   k:this.keyword.toUpperCase(),//转大写
      //   // },
      //   params:{//传递params参数，传递这种参数，需要使用路由的name名，并且配置占位符占位，/search/:keword
      //     keyword:this.keyword || '' || undefined,  //''空串为false  ，逻辑或，当逻辑或前者为false时，表达式结果将是第二个操作数
      //   }
      // },(succe)=>{
      //   console.log(succe)},(err)=>{
      //   // console.log(err);
      //   console.log('11');
      // });

      // console.log(pro);//使用编程式路由导航跳转，传递参数时，this.$router.push|replace ,其实就是一个promise对象，可以使用.then .catch进行处理
      // pro.catch(err=> {
      //   // let str=err.toString().replace('*','');
      //   // console.log(str)})
      //   return err;//直接将错误return出去  治标不治本
      // })
    },
    //退出登录按钮
    async loginLeave(){
      // localStorage.removeItem('token');//删除用户身份标识token
      // this.$store.state.RegisterOrLoginVc.userInfo={};//删除用户信息，【隐藏 用户名 | 退出登录】
      try {
        await this.$store.dispatch('RegisterOrLoginVc/getUserLogout');
        //没有捕获到错误code===200，退出登录成功，进行路由跳转
        this.$router.push({
          name:'home'
        })
      }
      catch(err) {
        alert(err.message);

      }
      //联系actions发请求，告诉服务器要退出登录【服务器删除对应的token】
      //我们先不删除本地储存中的token，只是联系服务器要退出登录，服务器删除了我们请求头中的对应token，我们Home组件在挂载的时候还是发请求拿用户登录
      // 信息【本地存储中有token】带的token字段的请求头，但是由于服务器已经删除了这个token令牌【也就是说我们传递的是一个已经无效的token，服务器找不到此token】，
      //所以就不会返回用户信息数据【Header组件就显示 登录 | 注册】
    }
  },
  mounted() {
    //给组件绑定自定义事件clear 监听 并给一个回调
    this.$bus.$on('clear',()=>{
      this.keyword='';
    });
    // this.$store.dispatch('RegisterOrLoginVc/getUserInfo');
    // console.log('Header组件挂载完成--')
  },
  computed:{
   userName(){
     return this.$store.state.RegisterOrLoginVc.userInfo.name;//拿小仓库中的用户名
   }
    // ...mapState('RegisterOrLoginVc',['userRz']),//这里我们想使用注册与登陆小仓库中的用户名，但是vuex储存数据不是持久化的【一刷新就没了】
  }
}
</script>

<style scoped lang="less">
.header {
  &>.top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          &+a {
            border-left: 1px solid #b3aeae;
          }
        }

      }

    }
  }

  &>.bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}


.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }
}




</style>