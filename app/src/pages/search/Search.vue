<template>
  <div>
<!--    三级列表-->
    <Type-nav />
    <div class="main">
      <div class="py-container">
        <!--bread  面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
<!--            <li class="with-x">手机</li>-->                        <!--根据对应冷心参数的有无选择显示或隐藏，并拿着参数中对应的数据展示-->
            <li class="with-x" v-if="shangpinCanShu.categoryName">{{shangpinCanShu.categoryName}}<i @click="removeMianBaoXieQuery">×</i></li>
            <li class="with-x" v-if="shangpinCanShu.keyword">{{shangpinCanShu.keyword}}<i @click="removeMianBaoXieParams">×</i></li>
            <li class="with-x" v-if="shangpinCanShu.trademark">{{shangpinCanShu.trademark.substring(shangpinCanShu.trademark.indexOf(':')+1)}}<i @click="removeMianBaoXieTradMark">×</i></li>
            <li class="with-x" v-for="p of shangpinCanShu.props" v-if="p">{{p.split(':')[1]}}<i @click="removeMianBaoXieProps(p)">×</i></li>
          </ul>
        </div>

        <!--selector Search路由组件的子组件-->   <!--向子组件传递映射小仓库getters中的数据-->
        <SearchSelector :trademarkList="trademarkList" :attrsList="attrsList" ref="searchSer"/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!--active这个类名就是背景颜色-->         <!--indexOf('1')!==-1 不等于-1，就是能够查找到的-->
                <li  :class="{active:shangpinCanShu.order.includes('1')}" @click="isAscOrDesc('1')">
                  <a>综合<span v-if="shangpinCanShu.order.includes(('1'))" class="iconfont" :class="shangpinCanShu.order.includes('desc') ? 'icon-up' : 'icon-up1'"></span></a>
                </li>
                <li :class="{active:shangpinCanShu.order.includes('2')}" @click="isAscOrDesc('2')">
                  <a>价格<span v-if="shangpinCanShu.order.includes('2')" class="iconfont" :class="shangpinCanShu.order.includes('desc') ? 'icon-up' : 'icon-up1'"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="g of goodsList" :key="g.id">
                <div class="list-wrap" @click="goDetail(g.id)">
                  <div class="p-img">
                    <!--lazyload插件在使用时，会创建一个自动定义指令-->
                    <a target="_blank"><img v-lazy="g.defaultImg"/></a>
                  </div>
                  <div class="price">
                    <strong>
                      <em style="margin-right:10px ">¥</em>
                      <i>{{g.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{g.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul >
          </div>
          <!--分页器组件--> <!--当前页数 每一页展示的数量 共多少条数据 连续的页码数-->  <!--测试分页器，这里的数据以后需要替换-->
            <Pagination :pageNo="shangpinCanShu.pageNo" :pageSize="shangpinCanShu.pageSize" :total="searchShangPinLists.total" :continues="5" @getPageNo="getPaginPageNo"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchSelector from './SearchSelector/SearchSelector';
  import {mapState,mapGetters} from "vuex";
  export default {
    name: 'Search',
    data(){
      return {
          shangpinCanShu:{//请求时传递的参数
            category1Id: "",//一级分类
            category2Id: "",
            category3Id: "",
            categoryName: "",//分类的名
            keyword: "",//搜索的关键字
            order: "1:desc",//价格排序
            pageNo: 1,//当前页数
            pageSize: 5,//每一页的数据
            props:  [],//平台售卖属性的参数  ["id:value:name"]这种格式
            trademark: "",//品牌  //子组件的参数数据
        },
      }
    },
    //将联系actions请求，放置在methods对应的函数中。
    methods:{
      getShangPinData(){//向服务器多次发送search模块的请求，获取数据（根据参数不同返回不同的数据进行展示），把联系actions请求封装为一个函数，需要的时候调用即可。
        this.$store.dispatch('SearchVc/getShangPinList',this.shangpinCanShu);//用户每次点击某个选项，调用事件回调函数，发送请求，传递相关参数，到服务器。
      },
      //删除面包屑的事件回调（就会用户不想要这条搜索选项了🔺）
      //最重要的是要把传给服务器的参数修改
      removeMianBaoXieQuery(){
        this.shangpinCanShu.categoryName='';//清空就为false，v-if为false 元素就会被删除
        this.shangpinCanShu.category1Id=undefined;//值为undefined，请求的时候就不会对应的属性就不会传给服务器，、。
        this.shangpinCanShu.category2Id=undefined;
        this.shangpinCanShu.category3Id=undefined;
        // this.getShangPinData();//再次发送请求
        //不需要加if判断 $route.params有无，没有值的话也是空对象，也是true
        //进行路由跳转清除地址栏中的query参数
        this.$router.push({  //为什么不需要再次发送请求了，因为我们在使用编程式路由导航消除地址栏中的query参数的同时，把原来$route中的参数也修改的（原本有query参数，我们只传了params参数）
          name:'search',
          params:this.$route.params,
        })
      },
      removeMianBaoXieParams(){
        this.shangpinCanShu.keyword='';
        // this.getShangPinData();//不需要再次发请求，因为下面路由跳转参数的变化会被监视属性监听到
        //路由跳转，删除地址栏中的params参数
        this.$router.push({
          name:"search",
          query:this.$route.query,
        })
        this.$bus.$emit('clear');//调用自定义事件clear
      },
      // getTrademark(kid,kname){//自定义事件selerKWr 回调函数
      //   this.shangpinCanShu.trademark=`${kid}:${kname}`;//把子组件的参数数据拿过来放到data中  参数类型为字符串
      //   //发送请求
      //   this.getShangPinData();
      // },
      removeMianBaoXieTradMark(){
        this.shangpinCanShu.trademark='';
        //这里没有进行路由传递参数，不需要清空地址栏参数，就不需要编程式路由导航（修改参数会引起监视属性的监视--发送请求）
        this.getShangPinData();//所以在这里我们需要 再次发送请求
      },
      removeMianBaoXieProps(p){
        //删除对应的数据参数props的数组元素
        this.shangpinCanShu.props.splice(this.shangpinCanShu.props.indexOf(p),1);
        this.getShangPinData();
      },
      //升序降序部分回调 修改数据参数order
      isAscOrDesc(leiXing){//leiXing用判断点击的是综合还是价格
        let orderleiXing=this.shangpinCanShu.order.split(':')[0];//1 或 2
        let orderSort=this.shangpinCanShu.order.split(':')[1];//asc 或 desc
        let newOrder='';//新的参数
        if(leiXing===orderleiXing){//点击相同的
          newOrder=`${leiXing}:${orderSort==='desc' ? 'asc' : 'desc'}`;
        }
        else{//点击不同的
          newOrder=`${leiXing}:desc`;
        }
        this.shangpinCanShu.order=newOrder;
        this.getShangPinData();
        //点击综合
        // if(leiXing==='1'){
        //   this.shangpinCanShu.order=this.shangpinCanShu.order.includes('desc') ? '1:asc' : '1:desc';
        //   this.getShangPinData();
        //   // if (this.shangpinCanShu.order.includes('desc')){
        //   //   this.shangpinCanShu.order='1:asc';
        //   //   this.getShangPinData();
        //   // }
        //   // else{
        //   //   this.shangpinCanShu.order='1:desc';
        //   //   this.getShangPinData();
        //   // }
        // }
        // else if(leiXing==='2'){//点击价格
        //   this.shangpinCanShu.order=this.shangpinCanShu.order.includes('desc') ? '2:asc' : '2:desc';
        //   this.getShangPinData();
        //   // if (this.shangpinCanShu.order.includes('desc')){
        //   //   this.shangpinCanShu.order='2:asc';
        //   //   this.getShangPinData();
        //   // }
        //   // else{
        //   //   this.shangpinCanShu.order='2:desc';
        //   //   this.getShangPinData();
        //   // }
        // }

      },
      getPaginPageNo(p){//自定义事件，父组件接收子组件传递过来的当前页码值
          this.shangpinCanShu.pageNo=p;//修改数据参数
          this.getShangPinData();//发送请求
      },
      //编程式路由导航 跳转Detail路由组件
      goDetail(id){
        this.$router.push({
          name:'detail',
          params:{Id:id}, //注意这里Id要与路由配置中使用的占位符相同  path:'/detail/:Id'
        })
      }
    },
    beforeMount() {//在挂载之前（联系actions请求发送前），整理好要传递的参数  ,钩子只会被调用一次
      //复杂写法
      // this.shangpinCanShu.category1Id=this.$route.query.category1Id;
      // this.shangpinCanShu.category2Id=this.$route.query.category2Id;
      // this.shangpinCanShu.category3Id=this.$route.query.category3Id;
      // this.shangpinCanShu.categoryName=this.$route.query.categoryName;
      // this.shangpinCanShu.keyword=this.$route.params.keyword;
      //使用Object.assign()方法，就是浅拷贝的语法糖
      // let query={category1Id:'1',categoryName:'手机'};
      // let params={keyword:'vivo'};
      // let p=Object.assign(this.shangpinCanShu,query,params);
      // console.log(p)                      //拷贝后面的对象到第一个对象中
      Object.assign(this.shangpinCanShu, this.$route.query, this.$route.params);//有新的值就会直接把原来值换为新的。路由中有参数就拷贝到参数对象中一起传递
      // console.log('整理参数',this.shangpinCanShu);
      // console.log('beforeMount整理参数')
    },
    // 在search组件挂载的时候联系对应组件小仓库actions，发送请求
     mounted() {//注意：如果联系actions请求放到mounted钩子中的话，请求只能够发送一次（在组件挂载完成的时候）数据就过来了，而如果用户有点击了某些选项，传递参数给服务器，还是需要发送请求。
      // this.$store.dispatch('SearchVc/getShangPinList',{});
      this.getShangPinData(); //在挂载的时候需要请求一次数据，不然用户在本页面书信的时候数据会丢失，本页面最初的数据渲染也就没了。
      //trademark参数的接收// 挂载的时候绑定自定义事件 监听自定义事件     这里回调也可以写成this.getTrademark
      this.$refs.searchSer.$on('selerKWr',(kid,kname)=>{
        this.shangpinCanShu.trademark=`${kid}:${kname}`;//把子组件的参数数据拿过来放到data中  参数类型为字符串
        //需要修改当前页数（页码），点击新的产品的时候，页码会加成上一个产品的切换到这个产品时的页码
        this.shangpinCanShu.pageNo=1;
        //发送请求
        this.getShangPinData();
      });
      //平台售卖属性参数props的接收
      this.$refs.searchSer.$on('pingTaiShouMaiPr',(val,v)=>{
        let props=`${val.attrId}:${v}:${val.attrName}`;
        if(this.shangpinCanShu.props.indexOf(props)===-1){//props中没有，我们再放进去（去重）
          this.shangpinCanShu.props.push(props);//不断追加平台售卖属性数据
          this.getShangPinData();//整理完参数 发送请求
        }
      });
      // this.$refs.paginationPageNo.$on('getPageNo',(p)=>{
      //   this.shangpinCanShu.pageNo=p;
      //   this.getShangPinData();
      // })
       //发请求拿用户数据
       // this.$store.dispatch('RegisterOrLoginVc/getUserInfo');//有token，请求时请求头中携带，服务器校验，返回用户数据，Header组件中对应用户信息渲染
    },

    watch:{
      //监听$route的参数的变化
      $route:{//这里不用this
        deep:true,
        // immediate:true,//使用了这个在点击三级列表路由组件跳转的时候，就会发送两次请求，这里可以监测到数据的变化，发送一次请求，mounted钩子在Search组件挂载的时候发一次请求
        handler(newVal){
          //发送请求之前清空上一次的参数列表Id
          //为什么要清空上一次三级列表的id，如果上一次点击的是一级列表，会把一级列表的id存到data参数对象数据中，但是如果我们又点击三级列表的话，参数对象中的三级列表id也有了数据，上次的一级id还在里面。
          //三级列表参数名字不用清空，因为他不像三级列表id是判断分支的（每次是三个选择一个传），三级列表name每次点击新的旧的就会被替换。
          //keyword搜索关键字，每次搜素也会被替换
          this.shangpinCanShu.category1Id='';
          this.shangpinCanShu.category2Id='';
          this.shangpinCanShu.category3Id='';
          // console.log('路由参数数据发生变化，已被监听到',newVal);
          // 调用联系actions发送请求函数之前整理参数
          Object.assign(this.shangpinCanShu,newVal.query,newVal.params);//为什么在这个时候id不会被清空？每一次路由query参数中只有两个数据（某一级列表的id，以及名字）
          console.log('数据发生变化被监听到整理参数');
          this.getShangPinData();
          //在每一次请求完之后，如果category1Id 2Id 3Id还存有数据，就把他们请求空，留下一个空位置（待存），防止我们，上次搜索的参
          // 数（三级列表信息），存留到这次，用户通过关键词搜索，两者关系不匹配（手机==》华为 匹配，热水器==》华为 不匹配）
        }
      }
    },
    computed:{
      //映射SearchVc小仓库中的searchShangPinLists数据
      //可以把请求的数据对象中的每个数组分别拿出来。
      ...mapState('SearchVc',['searchShangPinLists']),
      ...mapGetters('SearchVc',['goodsList','trademarkList','attrsList']),//映射小仓库getters计算属性中对请求简化的数据。

    },
    components: {
      SearchSelector//注册子组件
    },

  }
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                }

                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>