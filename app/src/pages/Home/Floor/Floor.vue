<template>
  <!--楼层-->
  <div class="floor">
    <div class="py-container" >
      <div class="title clearfix">
        <h3 class="fl">{{floor.name}}</h3>
        <div class="fr">
          <ul class="nav-tabs clearfix" >
            <li class="active"  v-for="navL of floor.navList">
              <a href="#tab1" data-toggle="tab">{{navL.text}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane">
          <div class="floor-1">
            <div class="blockgary">
              <ul class="jd-list">
                <li v-for="k of floor.keywords">{{k}}</li>
              </ul>
              <img :src="floor.imgUrl" />
            </div>
            <div class="floorBanner">
              <!--轮播图部分-->
              <div class="swiper-container" id="floor1Swiper" ref="cur">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="f of floor.carouselList" :key="f.id">
                    <img :src="f.imgUrl">
                  </div>

                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination"></div>

                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
              </div>
              <!--Swiper轮播图组件-->
<!--              <Caiousel :list="floor.carouselList"/>-->
            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit" v-for="r of floor.recommendList.slice(0,2)">
                <img :src="r" />
              </div>
<!--              <div class="floor-conver-pit">-->
<!--                <img src="./images/floor-1-3.png" />-->
<!--              </div>-->
            </div>
            <div class="split center">
              <img :src="floor.bigImg" />
            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit" v-for="r1 of floor.recommendList.slice(2)">
                <img :src="r1" />
              </div>
<!--              <div class="floor-conver-pit">-->
<!--                <img src="./images/floor-1-6.png" />-->
<!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
//引入js
import Swiper from "swiper";
import 'swiper/css/swiper.css';
export default {
  name: "Floor",
  props:['floor'],//接收父组件Home传递过来的数据。v-for遍历出来的floor
  // //使用计算属性 通过mapState映射小仓库中的数据
  // computed:{
  //   ...mapState('HomeVc',['floorslist']),
  // },
  //使用监视监视数据的变化floorslist，当请求过来数据的时候调用handler
  watch:{
    //监测floor是不会监测到的，因为当floors组件挂载的时候就数据就已经由Home父组件传递过来了。
    floor:{
      deep:true,
      immediate:true,//一开始就调用一次，监听数据的变化。
      handler(newVal){//这样只能够确保数据已经有了，但是dom更新属于异步任务，会在事件循环中进行
          //不能够确保页面有dom  要抓住它在事件完成之后 生成dom后的时间
        this.$nextTick(function (){
          //在这里操作更新后的dom
          new Swiper(this.$refs.cur, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay:true,
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
  },
  //floor组件的数据是在其父组件中请求的，在父组件中拿到的数据并且传递给floor子组件
  //Home组件先挂载，联系actions发送请求，将数据放入state中，Home组件mapState映射floorslist数据，并传递给子组件。这时子组件再挂载完成，就已经有数据了
  // mounted() {
  //   // alert('2初始化swiper实例');//先弹home组件的1 再弹floor组件的2（所以是Home组件先挂载，然后子组件挂载）
  //   new Swiper(this.$refs.cur, {
  //     slidesPerView: 1,
  //     spaceBetween: 30,
  //     loop: true,
  //     autoplay:true,
  //     pagination: {
  //       el: ".swiper-pagination",
  //       clickable: true,
  //     },
  //     navigation: {
  //       nextEl: ".swiper-button-next",
  //       prevEl: ".swiper-button-prev",
  //     },
  //   });
  // }
}
</script>

<style scoped lang="less">
.floor {
  margin-top: 15px;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .title {
      .fl {
        float: left;
        color: #c81623;
        font-size: 20px;
        line-height: 30px;
        margin: 9px 0;
        font-weight: 700;
      }

      .fr {
        float: right;

        .nav-tabs {
          margin: 10px 0 0;
          display: inline-block;

          li {
            float: left;
            line-height: 18px;

            a {
              padding-top: 1px;
              font-weight: 400;
              background-color: #fff;

              &::after {
                content: "|";
                padding: 0 10px;
              }
            }

            &:nth-child(7) {
              a {
                &::after {
                  content: "";
                }
              }
            }

            &.active {
              a {
                color: #e1251b;
              }
            }
          }
        }
      }
    }

    .tab-content {
      border-top: 2px solid #c81623;
      border-bottom: 1px solid #e4e4e4;

      .tab-pane {
        .floor-1 {
          height: 360px;
          display: flex;

          .blockgary {
            width: 210px;
            height: 100%;
            background: #f7f7f7;

            .jd-list {
              padding: 15px 0;
              overflow: hidden;

              li {
                list-style-type: none;
                float: left;
                width: 40%;
                margin: 0 10px;
                border-bottom: 1px solid #e4e4e4;
                text-align: center;
                line-height: 26px;
              }
            }

            img {
              width: 100%;
            }
          }

          .floorBanner {
            width: 330px;
            height: 100%;
          }

          .split {
            width: 220px;
            height: 100%;
            position: relative;

            .floor-x-line {
              position: absolute;
              background: #e4e4e4;
              width: 220px;
              height: 1px;
              top: 180px;
            }

            .floor-conver-pit {
              width: 100%;
              height: 50%;

              img {
                width: 100%;
                height: 100%;
                transition: all 400ms;

                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

          .center {
            border: 1px solid #e4e4e4;
          }
        }
      }
    }
  }
}

</style>