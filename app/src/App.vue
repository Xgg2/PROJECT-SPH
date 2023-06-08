<template>
  <div>
    <Header/>
   <!--路由组件出口-->
    <router-view></router-view>
   <!--在主页和搜索是显示，登录注册是隐藏   满足任意一个就显示，一个都不满足就隐藏-->
<!--    <Footer v-show="$route.path=='/home' || $route.path=='/search'"/>-->
    <Footer v-show="$route.meta.dispyFooter"/>
  </div>
</template>

<script>
import Header from './components/Header/Header.vue';
import Footer from "@/components/Footer/Footer";
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    // console.log(this.$route);//在这里的$route就是当前url上的路径对应的路由组件的路由信息，这里的$route在同一个时间点只能有一个
                              //根据当前显示的路由，对应的路由信息，中配置的路由元信息，确定当前的Footer组件是否是隐藏，如果当前所切换
                              // 的路由元信息的值为false，就会隐藏Footer组件
    // console.log('我是根组件');//在这里不管切换到那个路由组件，App组件只挂载一次，我们可以在这里发送请求,就避免了我们在来回切换路由组件的时候不断
    this.$store.dispatch('HomeVc/getShangPinList');  //挂载，不断向服务器发送请求。
    //发请求，拿用户登录后的用户信息
    // this.$store.dispatch('RegisterOrLoginVc/getUserInfo');//Header全局组件的用户信息一上来没有，刷新才有

  },
  updated() {
    console.log(this.$route)
  }
}
</script>

<style>

</style>
