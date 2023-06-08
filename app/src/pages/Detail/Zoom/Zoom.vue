<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl"/>
    <!--事件元素-->
    <div class="event" @mousemove="maskMove($event)"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big"/>
    </div>
    <!--移动的背景图标 ，遮罩   -->
    <div class="mask" ref="mask"></div>
  </div>
</template>
<!--放大镜-->
<script>
  export default {
    name: "Zoom",
    props: ['skuImageList'],
    data(){
      return {
        // skuImageListAr:[],//第一种方式点击轮播图大图显示//来一个响应式数据 ，数据变页面使用数据的地方也变
        skuImageIndex:0,//默认为0，第一个
      }
    },
    methods:{
      maskMove(e){//不传递其他参数的时候，$event可以不写（没有其他参数 默认）
        // console.log(e.offsetX,e.offsetY)//距离边框的距离（自己）
        let mask=this.$refs.mask;//遮罩元素
        let left=e.offsetX-mask.offsetWidth/2;//鼠标就在中间区域
        let top=e.offsetY-mask.offsetHeight/2;
        let big=this.$refs.big;
        if(left<0){
          left=0;
        }
       if(left>mask.offsetWidth){ //判断超出最大left，还是利用left,遮罩款就是大盒子的一半，left超过遮罩宽度（大盒子一半），就出去了，
         left=mask.offsetWidth;
        }
        if(top<0){
          top=0;
        }
         if(top>mask.offsetHeight){
              top=mask.offsetHeight
        }
        mask.style.left=left+'px';
        mask.style.top=top+'px';
        //大图
        big.style.left=-2*left+'px';
        big.style.top=-2*top+'px';
      }
    },
    computed:{
      imgObj(){
          // return this.skuImageListAr || {}; //第一种方式//这里因为数组的每一个元素是对象，所以要写一个空对象，当数据没有来undefined，就走后面{}
          return this.skuImageList[this.skuImageIndex] || {};
      }
    },
    //第一种方式// watch:{
    //   skuImageList:{
    //     immediate:true,
    //     handler(newVal,oldVal){
    //       this.skuImageListAr=newVal[0]
    //     }
    //   }
    // },
    // mounted() {
    //   this.$bus.$on('isImage',(p)=>{
    //     this.skuImageListAr=p;
    //   })
    // }
    mounted() {
      this.$bus.$on('isImage',(index)=>{
        this.skuImageIndex=index;
      })
    }
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 191, 255, 0.1);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>