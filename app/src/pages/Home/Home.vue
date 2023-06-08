<template>
<div>
<!--  三级联动已经注册全局组件，不许要引入-->
<!--  商品导航分类-->
  <Type-nav/>
<!--  列表-->
  <Listcontainer/>
<!--  今日推荐-->
  <Recommend/>
<!--  排行-->
  <Rank/>
<!--  喜欢-->
  <Like/>
<!--  楼层-->          <!--把数据传给子组件-->
  <Floor v-for="floor of floorslist" :key="floor.id" :floor="floor"/>
<!--  <Floor/>-->
<!--  商标-->
  <Brand/>


</div>
</template>

<script>
import Listcontainer from "@/pages/Home/ListContainer/Listcontainer";
import Recommend from "@/pages/Home/Recommend/Recommend";
import Rank from "@/pages/Home/Rank/Rank";
import Like from "@/pages/Home/Like/Like";
import Floor from "@/pages/Home/Floor/Floor";
import Brand from "@/pages/Home/Brand/Brand";
import {mapState} from 'vuex';
export default {
  name: "Home",
  components:{
    Listcontainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  methods:{
    async getUserInfo(){//因为要使用async与await ，封装到函数中
      try {
        await this.$store.dispatch('RegisterOrLoginVc/getUserInfo');  //使用await 就不会出现错误
      }
     catch(err) {

     }
    }
  },
  mounted() {//mounted 这种生命周期钩子不能使用async 与await
    //挂载完毕 联系actions中的方法发送请求给 /mock/floors假接口
    this.$store.dispatch('HomeVc/mockgetfloorslist');
    // alert('1联系actions发送请求');
     //登录成功后，路由跳转到首页 联系actions发请求 拿用户信息
    this.getUserInfo();
  },
  computed:{
    ...mapState('HomeVc',['floorslist']),//floor组件的数据是在home路由组件中请求的，以及映射的
  },
  updated() {
    // console.log(this.$route)
  },
}
</script>

<style scoped>

</style>