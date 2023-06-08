<template>
  <div class="swiper-container" id="floor1Swiper" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="k of list" :key="k.id">
        <img :src="k.imgUrl">
      </div>

    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
import 'swiper/css/swiper.css';
//轮播图全局组件
export default {
  name: "Caiousel",
  props:['list'],
  watch:{
    list:{
      immediate:true,
      handler(){
        //不能够确保页面有dom  要抓住它在事件完成之后 生成dom后的时间
        this.$nextTick(function () {
          //在这里操作更新后的dom
          new Swiper(this.$refs.cur, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: true,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      }
    }
  }

}
</script>

<style scoped>

</style>