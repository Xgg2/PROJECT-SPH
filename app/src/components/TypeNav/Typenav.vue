<template>
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="searchVcListDisplayN" @mouseenter="searchVcListDisplayB">
<!--        两个同级的元素，事件mouseleave在其共同的父元素身上  事件委托-->
        <h2 class="all" >全部商品分类</h2>
        <!-- :style="{display: $route.path==='/search' ? 'none' : 'block'}"-->
        <transition name="animate__animated animate__bounce"
                    enter-active-class="animate__fadeIn ">    <!--不是detail就位真（显示）--> <!-- !1===1 false ，!1===2 false-->
          <div class="sort" ref="divListSort" v-show="show" v-if="!($route.name==='detail')">
            <!--        三级列表数据的动态渲染-->
            <div class="all-sort-list2" @click="goSearch($event)">
              <!--        一级列表-->            <!--当listBj中的数，为一级列表任意一个任意一个下标时，就会有这个类名，也就是cu:true时-->
              <div class="item" v-for="(k,index) of spList" :key="k.categoryId" :class="{cu:listBj===index}">
                <!--列表渲染 每个h3标签都绑定了一个移入事件 index就是对应的h3的for of下标（就是编号）-->
                <h3 @mouseenter="setlistBj($event,index)" >
                  <!--  编程式路由导航 ，不直接在每一个跳转元素身上加事件，而是利用事件委托-->
                  <!--  添加自定义属性   格式 :data-xxxx=""        SpList1Id类用的是这个属性名   -->
                  <a :data-SpListName="k.categoryName" :data-SpList1Id="k.categoryId">{{ k.categoryName }}</a>
                </h3>                   <!--控制二级列表显示与隐藏 动态添加display css属性-->
                <!-- v-for 每一个二级列表都会有一个这个样式判断，当我们触发移入事件时，会有一个index流向data中的listBj，
                二级列表的动态style样式中每一个元素都有一个对应index ，当元素对应的index与我们所触发的元素的index（listBj）相等时，就是true，动态样式就会被激活
                            其他的列表因为自己的index与触发的index（data中的listBj）不对应所以为false，动态样式不会被激活-->
                <div class="item-list clearfix" :style="{display:index===listBj ? 'block' : 'none'}">
                  <!-- 根据上一级列表的属性（数组）继续遍历             -->
                  <div class="subitem"  v-for="k1 of k.categoryChild" :key="k1.categoryId">
                    <!--        二级列表-->
                    <dl class="fore" >
                      <dt>
                        <a :data-SpListName="k1.categoryName" :data-SpList2Id="k1.categoryId">{{ k1.categoryName}}</a>
                      </dt>
                      <dd >
                        <em v-for="k2 of k1.categoryChild" :key="k2.categoryId">
                          <!--        三级列表 -->
                          <!--SpList3Id利用的是这个自定义属性名-->
                          <a :data-SpListName="k2.categoryName" :data-SpList3Id="k2.categoryId">{{k2.categoryName}}</a>
                        </em>

                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

            </div>
          </div >
        </transition>

      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>


    </div>
  </div>

</template>

<script>
import {mapState} from "vuex";
//按需引入
import throttle from 'lodash/throttle'
//全部引入
// import _ from 'lodash';
import 'animate.css'
export default {
  name: "TypeNav",
  data(){
    return{
      listBj:-1,//对应要添加背景的一级列表的标记
      show:true,//管理三级列表在search组件中的显示与隐藏
    }
  },
  methods:{
    //节流为什么要放到这里：因为一级列表触发移入事件的回调就在这里
    //使用lodash的_对象的throttle()方法，节流操作   二级列表的显示与隐藏  一级列表的背景都依赖与移入事件的触发，拿到了对应的index存到了data中的listBj
    setlistBj:throttle( function (e,i){//在这里不能使用箭头函数，否则this就指向上下文了，在methods中事件回调函数不能使用箭头函数，否则
      //拿到对应的元素标记                //this就不会指向组件vc了
      this.listBj=i;
      // console.log(this);//快速由上往下划过一级列表，不会所有的都触发
    },50),//节流函数，每50毫秒只能触发一次移入事件回调
    goSearch(e) {
      //【编程式路由导航+事件委托】为了不产生过多的router-link 以及过多的@click在每个元素身上。会造成卡顿
      //利用事件委托的问题在这里，点击父元素中的任何元素都会触发，还不能确保点击的是否是a，跳转的那个元素
      //问题：事件委托 在这里点击【div,h3,dl,dt】等都会触发，，我们只想点击a触发
      //如何确定点击的就是a标签
      //如何却顶点击的是一级、二级、三级的a标签
      let ele=e.target;//点击的那个元素
      //ele.dataset 属性会返回一个对象，对象的属性名和属性值是元素的属性和属性值.因此可以拿到（并解构）元素的属性
      let {splistname,splist1id,splist2id,splist3id}=ele.dataset;
      if(splistname){//在这里已经确定了点击的就是a，并且可以拿到对应a的内容
        let local={name:'search'};
        let query={ categoryName:splistname}
        //确定a的级别
        if(splist1id){//到这里，就确定了a，并且是几级列表的a，一级可以拿到对应的数据
            //确定点击的是一级列表的a
          // console.log('1')
          //整理
         query.category1Id=splist1id;
        }
        else if(splist2id){
            //确定点击的是二级列表的a
          // console.log('2')
          query.category2Id=splist2id;
        }
        else if(splist3id){
          //否则就是三级列表的a
          // console.log('3')
          query.category3Id=splist3id;
        }
        //整理
        local.query=query;//在这一步的时候$route:{path:'/search',params:{keyword:'小米'}} 这个$route在这里这样写是依据于这个场景来的，因为还没有到$router.push那里
        if(this.$route.params){//在我们编程式路由导航传递参数的时候，如果之前的$route中有参数（params）我们就把那个参数拿过来（追加进来），一起再传给Search组件
          local.params=this.$route.params;//有的话也传过去  在这时只是放入数据params,下面才是进行跳转（把这些参数传递）。
        }
        this.$router.push(local);//整理的包含路由条状路径，以及传递的参数的对象，放到push中，进行模块化路由导航
                                  //在这一步完成时$route:{path:'/search',query:{spListId:1,spListName:'手机'},params:{keyword:'小米'}}
      }
      // console.log(this.$route);

    },
    searchVcListDisplayB(){
      //判断三级列表是否是隐藏的，或者判断当前是否在/search路由组件中
      if(this.$route.path!=='/home'){
        this.show=true;
      }
    },
    searchVcListDisplayN(){
      this.listBj=-1;//鼠标移出，让整个三级列表隐藏
      if(this.$route.path!=='/home'){
        this.show=false;
      }
    }
  },
  mounted() {
    //通知vuex中的actions
    //如果不是home路由组件，将三级列表进行隐藏
    // console.log('typeNav组件挂载完毕')
    //在切换search组件中时，TypeNav组件也会经过再挂载一次
    if(this.$route.path!=='/home'){
      this.show=false;
    }
    // console.log(this.$route)
  },
  computed:{
      ...mapState('HomeVc',{spList:'spList'}),//要开启命名空间  ,拿到的三级列表的数据在这里
  },

}
</script>

<style scoped lang="less">
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
    .cu{
      background-color: skyblue;
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

          //&:hover {
          //  .item-list {
          //    display: block;
          //  }

        }
      }
    }
  }
}

</style>