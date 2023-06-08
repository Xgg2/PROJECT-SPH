<!--路由组件-->
<template>
  <div class="detail">
    <!-- 商品分类导航  这里商品分类不需要显示三级列表-->
    <Type-nav />

    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 导航路径区域 -->
      <div class="conPoin">
         <span v-show="categoryView.category1Name">{{categoryView.category1Name}}</span>
         <span v-show="categoryView.category2Name">{{categoryView.category2Name}}</span>
         <span v-show="categoryView.category3Name">{{categoryView.category3Name}}</span>
      </div>
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <!--放大镜效果-->         <!--skuInfo.skuImageList为undefined的时候给一个空数组--> <!--{}.name =undefined ,undefined.sex就会报错-->
          <Zoom :skuImageList="skuImageList"/>
          <!-- 小图列表 -->
          <ImageList :skuImageList="skuImageList"/>
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">{{skuInfo.skuName}}</h3>
            <p class="news">{{skuInfo.skuDesc}}</p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                <div class="price">
                  <i>¥</i>
                  <em>{{skuInfo.price}}</em>
                  <span>降价通知</span>
                </div>
                <div class="remark">
                  <i>累计评价</i>
                  <em>65545</em>
                </div>
              </div>
              <div class="priceArea2">
                <div class="title">
                  <i>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</i>
                </div>
                <div class="fixWidth">
                  <i class="red-bg">加价购</i>
                  <em class="t-gray">满999.00另加20.00元，或满1999.00另加30.00元，或满2999.00另加40.00元，即可在购物车换购热销商品</em>
                </div>
              </div>
            </div>
            <div class="support">
              <div class="supportArea">
                <div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
                <div class="fixWidth">以旧换新，闲置手机回收 4G套餐超值抢 礼品购</div>
              </div>
              <div class="supportArea">
                <div class="title">配 送 至</div>
                <div class="fixWidth">广东省 深圳市 宝安区</div>
              </div>
            </div>
          </div>

          <div class="choose">
            <div class="chooseArea">
              <div class="choosed"></div>
              <dl v-for="s of spuSaleAttrList">
                <dt class="title">{{s.saleAttrName}}</dt>
                <!--点击需要传递包含每一个选项的数组，以及点击的选项对应的数组元素（对象）                -->
                <dd changepirce="40" v-for="(l,index) of s.spuSaleAttrValueList" :key="l.id" :class="{active:isActiveColor===s.spuSaleAttrValueList.indexOf(l) && spuSaleAttrList.indexOf(s)===0 ||isActivebanben===s.spuSaleAttrValueList.indexOf(l) && spuSaleAttrList.indexOf(s)===1}" @click="setGaoLiang(s.spuSaleAttrValueList,l,s)">{{l.saleAttrValueName}}</dd>

              </dl>
            </div>
            <div class="cartWrap">
              <div class="controls">
                <input autocomplete="off" class="itxt" style="outline: none" v-model:value="skuNum">
                <a href="javascript:" class="plus" @click="addSkuNum">+</a>
                <a href="javascript:" class="mins" @click="reduceSkuNum">-</a>
              </div>
              <div class="add">
                <a href="javascript:" @click="addShoppingCart">加入购物车</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 内容详情页 这一块是假的数据-->
    <section class="product-detail">
      <aside class="aside">
        <div class="tabWraped">
          <h4 class="active">相关分类</h4>
          <h4>推荐品牌</h4>
        </div>
        <div class="tabContent">
          <div class="tab-pane active">
            <ul class="partList">
              <li>手机</li>
              <li>手机壳</li>
              <li>内存卡</li>
              <li>Iphone配件</li>
              <li>贴膜</li>
              <li>手机耳机</li>
              <li>移动电源</li>
              <li>平板电脑</li>
            </ul>
            <ul class="goodsList">
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part01.png" />
                  </div>
                  <div class="attr">Apple苹果iPhone 6s (A1699) </div>
                  <div class="price">
                    <em>¥</em>
                    <i>6088.00</i>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part02.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part03.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part02.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part03.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tab-pane">
            <p>推荐品牌</p>
          </div>
        </div>
      </aside>
      <div class="detail">
        <div class="fitting">
          <h4 class="kt">选择搭配</h4>
          <div class="good-suits">
            <div class="master">
              <img src="./images/l-m01.png" />
              <p>￥5299</p>
              <i>+</i>
            </div>
            <ul class="suits">
              <li class="suitsItem">
                <img src="./images/dp01.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="39">
                  <span>39</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp02.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="50">
                  <span>50</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp03.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="59">
                  <span>59</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp04.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="99">
                  <span>99</span>
                </label>
              </li>
            </ul>
            <div class="result">
              <div class="num">已选购0件商品</div>
              <div class="price-tit">
                套餐价
              </div>
              <div class="price">￥5299</div>
              <button class="addshopcar">加入购物车</button>
            </div>
          </div>
        </div>
        <div class="intro">
          <ul class="tab-wraped">
            <li class="active">
              <a href="###">
                商品介绍
              </a>
            </li>
            <li>
              <a href="###">
                规格与包装
              </a>
            </li>
            <li>
              <a href="###">
                售后保障
              </a>
            </li>
            <li>
              <a href="###">
                商品评价
              </a>
            </li>
            <li>
              <a href="###">
                手机社区
              </a>
            </li>
          </ul>
          <div class="tab-content">
            <div id="one" class="tab-pane active">
              <ul class="goods-intro">
                <li>分辨率：1920*1080(FHD)</li>
                <li>后置摄像头：1200万像素</li>
                <li>前置摄像头：500万像素</li>
                <li>核 数：其他</li>
                <li>频 率：以官网信息为准</li>
                <li>品牌： Apple</li>
                <li>商品名称：APPLEiPhone 6s Plus</li>
                <li>商品编号：1861098</li>
                <li>商品毛重：0.51kg</li>
                <li>商品产地：中国大陆</li>
                <li>热点：指纹识别，Apple Pay，金属机身，拍照神器</li>
                <li>系统：苹果（IOS）</li>
                <li>像素：1000-1600万</li>
                <li>机身内存：64GB</li>
              </ul>
              <div class="intro-detail">
                <img src="./images/intro01.png" />
                <img src="./images/intro02.png" />
                <img src="./images/intro03.png" />
              </div>
            </div>
            <div id="two" class="tab-pane">
              <p>规格与包装</p>
            </div>
            <div id="three" class="tab-pane">
              <p>售后保障</p>
            </div>
            <div id="four" class="tab-pane">
              <p>商品评价</p>
            </div>
            <div id="five" class="tab-pane">
              <p>手机社区</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import ImageList from './ImageList/ImageList'
  import Zoom from './Zoom/Zoom'
  import {mapState ,mapGetters} from "vuex";

  export default {
    name: 'Detail',
    components: {
      ImageList,
      Zoom
    },
    data(){
      return{
        isActiveColor:0,
        isActivebanben:0,
        skuNum:1,//购买产品个数 默认1个
        skuShuXing:{color:'',banben:''},
      }
    },
    methods:{
        //接收一个数组，一个当前点击选项对应的对象
        setGaoLiang(a,saleAttrVal,{baseSaleAttrId}){//传递的对象中解构id 用于判断是 第几行属性选项
          //这里用到的排他思想，要修改数组中所有的isChecked，class中的类名是根据isChecked来的（为1），所以就要拿到整个数组，还要修改点击的那一个，所以就要传递点击的那一个的数组元素
          a.map(el=>{//在这里可以使用forEach for..of ....
            return el.isChecked='0';
          });
          // for(var el of a){
          //   el.isChecked='0';
          // }
          // saleAttrVal.isChecked='1';

          //用户选择商品属性部分
          if(baseSaleAttrId===1){//用户点击的颜色行的属性
            this.skuShuXing.color=saleAttrVal.saleAttrValueName;
            this.isActiveColor=a.indexOf(saleAttrVal);
          }
          else {//用户点击内存行的属性
            this.skuShuXing.banben=saleAttrVal.saleAttrValueName;
            this.isActivebanben=a.indexOf(saleAttrVal);
          }

        },
      //购买商品个数+
      addSkuNum(){
          let reg=/^\d+$/;//数字长度是任意的  不管用户输入 1.5  ,-1 ,1f1都不合法。
            if(reg.test(this.skuNum.toString())){
              this.skuNum++;
            }
            else{
              this.skuNum=1;
              alert('非法字符');
            }
      },
      //购买商品个数-
      reduceSkuNum(){
        if(this.skuNum===1){
          return;
        }
        let reg=/^[\d]+$/;//数字长度是任意的
        if(reg.test(this.skuNum.toString())){
          this.skuNum--;
        }
        else{
          this.skuNum=1
          alert('非法字符');
        }
      },
      //加入购物车回调
       async addShoppingCart(){ //小仓库就不需要存数据了，请求成功参数传过去 服务器会有记录（服务器不会返回数据），后面不能跟太多参数（写一个对象形式传递）
          //dispatch联系actions中的函数发送请求，有成功或失败（服务器是否处理请求存入商品），这里调用actions中的async函数 返回一个带有状态带有数据 的promise对象
          try {
            //等待返回结果再走后面的promise的结果
            await  this.$store.dispatch('DetailVc/addorupdateshopcart',{skuId:this.$route.params.Id,skuNum:this.skuNum});//在这里传递参数
           //成功 服务器处理了 进行路由跳转
            window.sessionStorage.setItem('skuval',JSON.stringify(this.skuInfo));//使用本地储存（会话）存储
            this.$router.push({//还要带着商品属性传递
              name:'AddCartSuccess',
             // query:{skuInfo:this.skuInfo},//这样传一个商品信息对象过去也可以（url地址不太美观）
              params:{//params传参 需要使用占位符
                skuNum:this.skuNum,//传递一个购买数量
                // skuShuXing:this.skuShuXing,//这里还是传递了一个对象
                color:this.skuShuXing.color,
                banben:this.skuShuXing.banben,
              }
            })

          }
          catch(err){
            alert('服务器未响应');
          }
      }
    },
    computed:{
      ...mapState('DetailVc',['shangpinXiangQingData']),//请求的商品详情的数据
      ...mapGetters('DetailVc',['categoryView','skuInfo','spuSaleAttrList']),//映射小仓库getters中的计算出来的数据
      //给子组件的数据计算一下，设置一个默认值
      skuImageList(){
        return this.skuInfo.skuImageList || [];
      }
    },
    watch:{
      spuSaleAttrList(newVal){
        try {
          this.skuShuXing.color=this.spuSaleAttrList[0].spuSaleAttrValueList[0].saleAttrValueName;
          this.skuShuXing.banben=this.spuSaleAttrList[1].spuSaleAttrValueList[0].saleAttrValueName;
        }
        catch(err) {
          return;
        }

      }
    },
    mounted() {
      this.$store.dispatch('DetailVc/getShangPinList',this.$route.params.Id);
    },
    //组件内路由守卫 同一个路由路径，但是后面的参数更新，就会调用
    // beforeRouteUpdate(to,from,next){// 在当前路由改变，但是该组件被复用时调用  /detail/12   /detail/9 共用的/detail后面的值变，就会触发【路径从/detail/12 跳到/detail/9】就会调用此组件内路由守卫
    //   console.log('@更新')
    // },
  }
</script>

<style lang="less" scoped>
  .detail {
    .con {
      width: 1200px;
      margin: 15px auto 0;

      .conPoin {
        padding: 9px 15px 9px 0;

        &>span+span:before {
          content: "/\00a0";
          padding: 0 5px;
          color: #ccc;
        }
      }

      .mainCon {
        overflow: hidden;
        margin: 5px 0 15px;

        .previewWrap {
          float: left;
          width: 400px;
          position: relative;
        }

        .InfoWrap {
          width: 700px;
          float: right;

          .InfoName {
            font-size: 14px;
            line-height: 21px;
            margin-top: 15px;
          }

          .news {
            color: #e12228;
            margin-top: 15px;
          }

          .priceArea {
            background: #fee9eb;
            padding: 7px;
            margin: 13px 0;

            .priceArea1 {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                float: left;
                margin-right: 15px;
              }

              .price {
                float: left;
                color: #c81623;

                i {
                  font-size: 16px;
                }

                em {
                  font-size: 24px;
                  font-weight: 700;
                }

                span {
                  font-size: 12px;
                }
              }

              .remark {
                float: right;
              }
            }

            .priceArea2 {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                margin-right: 15px;
                float: left;
              }

              .fixWidth {
                width: 520px;
                float: left;

                .red-bg {
                  background: #c81623;
                  color: #fff;
                  padding: 3px;
                }

                .t-gray {
                  color: #999;
                }
              }
            }


          }

          .support {
            border-bottom: 1px solid #ededed;
            padding-bottom: 5px;

            .supportArea {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                margin-right: 15px;
                float: left;
              }

              .fixWidth {
                width: 520px;
                float: left;
                color: #999;
              }
            }
          }

          .choose {
            .chooseArea {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              dl {
                overflow: hidden;
                margin: 13px 0;

                dt {
                  margin-right: 15px;
                  float: left;
                }

                dd {
                  float: left;
                  margin-right: 5px;
                  color: #666;
                  line-height: 24px;
                  padding: 2px 14px;
                  border-top: 1px solid #eee;
                  border-right: 1px solid #bbb;
                  border-bottom: 1px solid #bbb;
                  border-left: 1px solid #eee;
                  cursor: pointer;

                  &.active {
                    color: green;
                    border: 1px solid green;
                  }
                }
              }
            }

            .cartWrap {
              .controls {
                width: 48px;
                position: relative;
                float: left;
                margin-right: 15px;

                .itxt {
                  width: 38px;
                  height: 37px;
                  border: 1px solid #ddd;
                  color: #555;
                  float: left;
                  border-right: 0;
                  text-align: center;
                }

                .plus,
                .mins {
                  width: 15px;
                  text-align: center;
                  height: 17px;
                  line-height: 17px;
                  background: #f1f1f1;
                  color: #666;
                  position: absolute;
                  right: -8px;
                  border: 1px solid #ccc;
                }

                .mins {
                  right: -8px;
                  top: 19px;
                  border-top: 0;
                }

                .plus {
                  right: -8px;
                }
              }

              .add {
                float: left;

                a {
                  background-color: #e1251b;
                  padding: 0 25px;
                  font-size: 16px;
                  color: #fff;
                  height: 36px;
                  line-height: 36px;
                  display: block;
                }
              }
            }
          }
        }
      }
    }

    .product-detail {
      width: 1200px;
      margin: 30px auto 0;
      overflow: hidden;

      .aside {
        width: 210px;
        float: left;
        border: 1px solid #ccc;

        .tabWraped {
          height: 40px;

          h4 {
            border-top: 3px solid #fff;
            float: left;
            line-height: 37px;
            width: 105px;
            text-align: center;
            border-bottom: 1px solid #ccc;

            &.active {
              border-top: 3px solid #e1251b;
              border-bottom: 0;
              font-weight: normal;
            }
          }
        }

        .tabContent {
          padding: 10px;

          .tab-pane {
            display: none;

            &.active {
              display: block;
            }

            &:nth-child(1) {
              .partList {
                overflow: hidden;

                li {
                  width: 50%;
                  float: left;
                  border-bottom: 1px dashed #ededed;
                  line-height: 28px;
                }
              }

              .goodsList {
                &>li {
                  margin: 5px 0 15px;
                  border-bottom: 1px solid #ededed;
                  padding-bottom: 5px;

                  .list-wrap {
                    .p-img {
                      text-align: center;

                      img {
                        width: 152px;
                      }
                    }

                    .price {
                      font-size: 16px;
                      color: #c81623;
                    }

                    .operate {
                      text-align: center;
                      margin: 5px 0;

                      a {
                        background-color: transparent;
                        border: 1px solid #8c8c8c;
                        color: #8c8c8c;
                        display: inline-block;
                        padding: 2px 14px;
                        line-height: 18px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .detail {
        width: 980px;
        float: right;

        .fitting {
          border: 1px solid #ddd;
          margin-bottom: 15px;

          .kt {
            border-bottom: 1px solid #ddd;
            background: #f1f1f1;
            color: #333;
            padding: 5px 0 5px 15px;
          }

          .good-suits {
            height: 170px;
            padding-top: 10px;

            .master {
              width: 127px;
              height: 165px;
              text-align: center;
              position: relative;
              float: left;

              img {
                width: 87px;
              }

              p {
                color: #c81623;
                font-size: 16px;
                font-weight: 700;
              }

              i {
                position: absolute;
                top: 48px;
                right: -25px;
                font-size: 16px;
              }
            }

            .suits {
              width: 668px;
              height: 165px;
              float: left;

              .suitsItem {
                float: left;
                width: 127px;
                padding: 0 20px;
                text-align: center;

                img {
                  width: 120px;
                  height: 130px;
                }

                p {
                  font-size: 12px;
                }

                label {
                  display: block;
                  position: relative;

                  input {
                    vertical-align: middle;
                  }

                  span {
                    vertical-align: middle;
                  }
                }
              }
            }

            .result {
              border-left: 1px solid #ddd;
              width: 153px;
              height: 165px;
              padding-left: 20px;
              float: left;

              .num {
                font-size: 14px;
                margin-bottom: 10px;
                margin-top: 10px;
              }

              .price-tit {
                font-weight: bold;
                margin-bottom: 10px;
              }

              .price {
                color: #B1191A;
                font-size: 16px;
                margin-bottom: 10px;
              }

              .addshopcar {
                background-color: #e1251b;
                border: 1px solid #e1251b;
                padding: 10px 25px;
                font-size: 16px;
                color: #fff;
                display: inline-block;
                box-sizing: border-box;
              }
            }
          }
        }

        .intro {
          .tab-wraped {
            background: #ededed;
            // border: 1px solid #ddd;
            overflow: hidden;

            li {
              float: left;

              &+li>a {
                border-left: 1px solid #ddd;
              }

              &.active {
                a {
                  // border: 0;
                  background: #e1251b;
                  color: #fff;
                }
              }

              a {
                display: block;
                height: 40px;
                line-height: 40px;
                padding: 0 11px;
                text-align: center;
                color: #666;
                background: #fcfcfc;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
              }
            }
          }

          .tab-content {
            .tab-pane {
              display: none;

              &.active {
                display: block;
              }

              &:nth-child(1) {
                .goods-intro {
                  padding-left: 10px;

                  li {
                    margin: 10px 0;
                  }
                }

                .intro-detail {
                  img {
                    width: 100%;
                  }
                }
              }
            }

          }
        }
      }
    }
  }
</style>