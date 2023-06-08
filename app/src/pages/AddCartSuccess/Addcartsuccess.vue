<template>
  <div class="cart-complete-wrap">
    <div class="cart-complete">
      <h3><i class="sui-icon icon-pc-right"></i>商品已成功加入购物车！</h3>
      <div class="goods">
        <div class="left-good">
          <div class="left-pic">
            <img :src="this.skuInfo.skuDefaultImg">
          </div>
          <div class="right-info">
            <p class="title">{{this.skuInfo.skuName}}</p>
            <p class="attr">颜色：{{this.$route.params.color}} 内存：{{this.$route.params.banben}} 数量：{{this.$route.params.skuNum}}</p>
          </div>
        </div>
        <div class="right-gocart">
          <!--跳回详情页的时候 传递一个产品id skuId-->       <!--传递params参数 ，因为detail组件挂载联系actions发请求，所传递的参数就是params参数id--> <!--这里参数不能传错了，不然跳转过去detail组件挂载的时候联系actions发请求，传的错误的id，服务器就会响应出错误的详情页-->
          <router-link class="sui-btn btn-xlarge" :to="`/detail/${skuInfo.id}`">查看商品详情</router-link>
          <router-link to="/shopcart">去购物车结算 > </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AddCartSuccess',
    computed:{
      skuInfo(state) { //拿点击加入购物车时 将商品详细信息存在本地储存中的数据
        return JSON.parse(sessionStorage.getItem('skuval'));
      }
    },
    mounted() {
      // console.log(this.skuInfo)
    },
  }
</script>

<style lang="less" scoped>
  .cart-complete-wrap {
    background-color: #f4f4f4;

    .cart-complete {
      width: 1200px;
      margin: 0 auto;

      h3 {
        font-weight: 400;
        font-size: 16px;
        color: #6aaf04;
        padding-top: 15px;
        padding-bottom: 15px;
        margin: 0;

        .icon-pc-right {
          background-color: #fff;
          border: 2px solid #6aaf04;
          padding: 3px;
          margin-right: 8px;
          border-radius: 15px;
        }
      }

      .goods {
        overflow: hidden;
        padding: 10px 0;

        .left-good {
          float: left;

          .left-pic {
            border: 1px solid #dfdfdf;
            width: 60px;
            float: left;
            img {
              width: 60px;
              height: 60px;
            }
          }

          .right-info {
            color: #444;
            float: left;
            margin-left: 10px;

            .title {
              width: 100%;
              line-height: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 14px;
            }

            .attr {
              color: #aaa;
            }
          }
        }

        .right-gocart {
          float: right;

          a {
            padding: 7px 36px;
            font-size: 15px;
            line-height: 22px;
            color: #333;
            background-color: #eee;
            text-decoration: none;
            box-sizing: border-box;
            border: 1px solid #e1e1e1;
          }

          a:hover {
            background-color: rgba(255, 0, 0, 0.7);
            border: 1px solid rgba(153, 153, 153, 0.8);
          }

          a:active {
            background-color: #e1e1e1;
            border: 1px solid #d5d5d5;
          }

          .btn-danger {
            background-color: #e1251b;
            color: #fff;
          }

          .btn-danger:hover {
            background-color: #e1251b;
          }
        }

      }
    }
  }
</style>