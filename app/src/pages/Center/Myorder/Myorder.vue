<template>
  <div>
  <div class="order-content">
    <div class="title">
      <h3>我的订单</h3>
    </div>
    <div class="chosetype">
      <table>
        <thead>
        <tr>
          <th width="29%">商品</th>
          <th width="31%">订单详情</th>
          <th width="13%">收货人</th>
          <th>金额</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
      </table>
    </div>
    <div class="orders">
  <!--每一次订单-->
      <table class="order-item" v-for="r of recordsinfo" :key="r.id">
        <thead>
        <tr>
          <th colspan="5">
            <span class="ordertitle">{{r.expireTime}}　订单编号：{{r.outTradeNo}}<span class="pull-right delete">
              <img src="../images/delete.png"></span>
            </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <!--每一次订单的商品列表-->
        <tr v-for="(d,index) of r.orderDetailList" :key="d.id">
          <td width="60%">
            <div class="typographic">
              <img :src="d.imgUrl" style="width: 100px;height: 100px">
              <a href="#" class="block-text">{{d.skuName}}</a>
              <span>x{{d.skuNum}}</span>
              <a href="#" class="service">售后申请</a>
            </div>
          </td>
          <!--因为v-for遍历每一次订单的商品列表，商品有几个，这里就会展示几次出来，这里我们只需要展示第一次就可以了-->
          <td :rowspan="r.orderDetailList.length" v-if="index===0" width="8%" class="center">{{r.consignee}}</td>
          <td :rowspan="r.orderDetailList.length" v-if="index===0" width="13%" class="center">
            <ul class="unstyled">
              <li>总金额¥{{r.totalAmount}}.00</li>
              <li>在线支付</li>
            </ul>
          </td>
          <td :rowspan="r.orderDetailList.length" v-if="index===0" width="8%" class="center">
            <a href="#" class="btn">{{r.orderStatusName}} </a>
          </td>
          <td :rowspan="r.orderDetailList.length" v-if="index===0" width="13%" class="center">
            <ul class="unstyled">
              <li>
                <a href="mycomment.html" target="_blank">评价|晒单</a>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
<!--  分页器 ，子组件Grouporder组件，子组件传父组件数据，自定义事件这里子组件绑定getPageNo自定义事件，子组件通过$emit触发这个事件并且可以传递数据到父组件，父组件可以在回调函数实参接收子组件所传递的数据-->
    <Pagination :pageNo="pageNo" :pageSize="limit" :total="myOrderinfo.total" :continues="5" ref="grouporder"/>
<!--     @getPageNo="getPaginPageNo"-->

  </div>
  <div class="like">
    <h4 class="kt">猜你喜欢</h4>
    <ul class="like-list">
      <li class="likeItem">
        <div class="p-img">
          <img src="../images/itemlike01.png" />
        </div>
        <div class="attr">
          <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
        </div>
        <div class="price">
          <em>¥</em>
          <i>3699.00</i>
        </div>
        <div class="commit">已有6人评价
        </div>
      </li>
      <li class="likeItem">
        <div class="p-img">
          <img src="../images/itemlike02.png" />
        </div>
        <div class="attr">
          Apple苹果iPhone 6s/6s Plus 16G 64G 128G
        </div>
        <div class="price">
          <em>¥</em>
          <i>4388.00</i>
        </div>
        <div class="commit">已有700人评价
        </div>
      </li>
      <li class="likeItem">
        <div class="p-img">
          <img src="../images/itemlike03.png" />
        </div>
        <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
        </div>
        <div class="price">
          <em>¥</em>
          <i>4088.00</i>
        </div>
        <div class="commit">已有700人评价
        </div>
      </li>
      <li class="likeItem">
        <div class="p-img">
          <img src="../images/itemlike04.png" />
        </div>
        <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
        </div>
        <div class="price">
          <em>¥</em>
          <i>4088.00</i>
        </div>
        <div class="commit">已有700人评价
        </div>
      </li>
    </ul>
  </div>

  </div>
</template>

<script>
export default {
  name: "Myorder",
  data(){
    return{
      pageNo:1,//当前的页码
      limit:2,//展示商品个数
      myOrderinfo:{},//存服务器返回过来的数据【个人中心 -个人订单】
    }
  },
   methods:{
    //不管是挂载，还是点击页码，都要发请求。
     async getMyOrder(){
      let response=await this.$Api.reqMyOrder(this.pageNo,this.limit);
      if(response.code===200){
        this.myOrderinfo=response.data;//服务器返回过来的数据存起来
      }

    },
     //分页器点击事件，修改当前页码数
     // getPaginPageNo(pageNums){//这里可以接收到子组件传递过来的数据
     //   this.pageNo=pageNums;//自定义事件，传过来的当前的页码  ，修改数据
     //   this.getMyOrder();//再次发请求 拿当前点击的页码数据进行展示
     // }
  },
  computed:{
    //计算商品数据【从请求过来的数据中简化】
    recordsinfo(){
          return this.myOrderinfo.records || [];//没有就先给一个空数组
    }
  },
  mounted() {
    this.getMyOrder();
    this.$refs.grouporder.$on('getPageNo',(pageNums)=>{
      this.pageNo=pageNums;//自定义事件，传过来的当前的页码  ，修改数据
      this.getMyOrder();
    })
  }
}
</script>

<style scoped>

</style>