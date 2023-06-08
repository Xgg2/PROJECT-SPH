<template>
  <div class="swiper-container" ref="pur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(p,index) of skuImageList" :key="p.id">
        <!--点击就修改data中的isActive数据，数据一变，模板中用到数据的地方就变-->
        <img :src="p.imgUrl" @click="isImg(p,index)" :class="{active:isActive==index}">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>
<!--小图列表-->
<script>

  import Swiper from 'swiper'
  export default {
    name: "ImageList",
    props:['skuImageList'],
    data(){
      return {
        isActive:-1,//默认第一张 ，下标为1
      }
    },
    methods:{  //index 0 1 2 3 ,默认第一个有class名
      isImg(p,index){//组件间通信 全局事件总线
        this.isActive=index;
        // this.$bus.$emit('isImage',p);//第一种方式//传递一个下标过去也可以
        this.$bus.$emit('isImage',index);//传递一个下标过去也可以

      }
    },
    watch:{//监视props中的数据，不用加this
      skuImageList(newVal){//监视属性保证有数据，$nextTick保证有结构
        this.$nextTick(()=>{
          new Swiper(this.$refs.pur, {
            slidesPerView: 3,//设置同时展示的图个数
            loop: true,
            slidesPerGroup:1,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        })
      }
    }

  }
</script>

<style lang="less" scoped>
  .swiper-container {
    height: 56px;
    width: 412px;
    box-sizing: border-box;
    padding: 0 12px;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;

        &.active {
          border: 2px solid #f60;
          padding: 1px;
        }

        //&:hover {
        //  border: 2px solid #f60;
        //  padding: 1px;
        //}
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: rgb(235, 235, 235);
      border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>