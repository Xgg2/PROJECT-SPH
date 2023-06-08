<template>
<!--我是分页器-->
  <div class="pagination">
                 <!--start不等于1为true，不等于1的时候上一页就会显示，等于1的时候就不会有上一页（不会出现第0页）    -->
    <button :disabled="pageNo===1" @click="$emit('getPageNo',pageNo-1)">上一页</button>


    <!--在连续页中有1就隐藏-->   <!--start开头这个不是以，就不会和这个按钮一样 ，start大于等于2就为真，就显示-->
   <!--拿着开始页测 【不能与1 或 ...同时出现的情况】-->
    <button v-if="centerPages.start>=2" @click="$emit('getPageNo',1)">1</button>
    <!--在这里start不能够等于2，就会出现1 ... 2 这种情况 ，（所以等于2时也是让他为false 隐藏）    -->
    <button v-if="centerPages.start>2">· · ·</button>           <!--在这里会遍历出1-end的页码，页码大于等于开始页码就显示--><!--所有大于连续页码开始页的页码都为真（显示）-->
    <!--我们在这里v-for是遍历的数字（end最后一个数），他会从一开始遍历，给一个显示的条件，利用（start），等遍历出来的数大于start的显示-->
    <button v-for="(p,index) of centerPages.end" :key="index" v-if="p>=centerPages.start" @click="$emit('getPageNo',p)" :class="{active:pageNo===p}">{{p}}</button>
                  <!--满足这个条件的就显示-->
    <!--最后一个页数小于最大页码数-1，最大页码数11，在end是几需要隐藏，end不能是11 、10 ，也就是小于10，就可以显示-->
    <!--拿着结束页测-->
    <button v-if="centerPages.end<pageNums-1">· · ·</button>
    <!--结束页不能等于总页数，就重了，更不能大于总页数    -->
    <button v-if="centerPages.end<pageNums" @click="$emit('getPageNo',pageNums)">{{pageNums}}</button>


    <button :disabled="pageNo===pageNums" @click="$emit('getPageNo',pageNo+1)">下一页</button>
    <button style="margin-left: 30px">共 {{total}} 条</button>
<!--    <p>{{centerPages}}-&#45;&#45;&#45;&#45;{{pageNo}}</p>-->
</div>
</template>

<script>
export default {
  name: "Pagination",
  // data(){
  //   return{
  //     page:0,
  //   }
  // },
  //      当前页    每页个数   共多少条   连续页数
  props:['pageNo','pageSize','total','continues'],
  // methods:{
  //   pageButtonJH(p){
  //     this.$emit('getPageNo',p);
  //     this.page=p
  //   },
  //   jianPage(){//上一页回调
  //     this.page=this.page-1
  //     this.$emit('getPageNo',this.page);
  //   },
  //   jiaPage(){//下一页回调
  //     this.page=this.page+1
  //     this.$emit('getPageNo',this.page);
  //   }
  // },
  computed:{
    //总共多少页
    pageNums(){
      //在这里会有多出来的数据，我们向上取整
      return Math.ceil(this.total/this.pageSize);
    },
    //根据当前页数计算出一组值（值的个数对应中间连续页码的个数）
    centerPages(){ //计算出开始页码数，结束页码数。🔺
      //pageNo就是当前的页码 连续的页码5页
      // return [`${this.pageNo-2}`,`${this.pageNo-1}`,`${this.pageNo}`,`${this.pageNo+1}`,`${this.pageNo+2}`];
      //根据当前页判断  会出现非正常情况（页码数总共不到5页）
      //如果当前页是第一页
    //   let pageArr=[];
    //   if (this.pageNo===1){
    //     for (let i=this.pageNo;i<=5;i++){
    //       pageArr.push(i);
    //     }
    //   }
    //   //如果当前页是最后一页
    //   if(this.pageNo===this.pageNums){
    //     for (let i=this.pageNums;i>=this.pageNums-4;i--){
    //       pageArr.unshift(i);
    //     }
    //   }
    //   return pageArr;
      let start=0;//连续页码中开始的页码数
      let end=0;//连续页码中结束的页码数
      //不正常现象 总页数小于连续页数 【就是凑不出连续页数来】  ，这样的话，就是有几页，几页连续（都凑不出连续的页数）
      if(this.pageNums<this.continues){
        start=1;
        end=this.pageNums;//小于连续页数，最后的页码可以是【1，2，3，4】
      }
      else{//正常情况下 总页数大于或等于连续页数（5）【就可以凑出连续页数的页】  ,但是当前页为1..的时候会有问题，开始为-1，不能够出现负数
        start=this.pageNo-Math.floor(this.continues/2);//因为是公用的分页器，中间连续的页数可能是5，也可能是7，在这里我们写一个动态的
        end=this.pageNo+Math.floor(this.continues/2); //parseInt(7/2) 为3 就像向下取整
         //处理出现负数的情况
        if(start<=0){    //连续个数为5，当前页为1，-1 0 1 2 3 ==> 1 2 3 4 5，当前页为2，0 1 2 3 4  ==>1 2 3 4 5  ，再往后就正常范围了
          start=1;
          end=this.continues; //在出现负数或0的情况，把开始页变为1，根据连续页数，结束页都是5
        }
        //计算出来的结束页码，不能够超出最大页码。等于可以
        if(end>this.pageNums){ //可以等于最大页码数
          start= this.pageNums-this.continues+1;        //结束页end大于最大页的情况，往前挪，两种情况最小都是7
          end=this.pageNums;  //当前页11   ,总页数11 --9 10 11 12 13  ==>7 8 9 10 11   ,当前页10 ,总页数 11--8 9 10 11 12  ==> 7 8 9 10 11  ,
                              //当前页再小的话，end就属于正常范围了【基于以上例子，start都是7】
        }
      }
      return {start,end};//计算属性返回一个对象，可以计算属性名.对象k使用
    }
  }
}
</script>

<style scoped lang="less">
.pagination {
  text-align: center;
button {
  margin: 0 5px;
  background-color: #f4f4f5;
  color: #606266;
  outline: none;
  border-radius: 2px;
  padding: 0 4px;
  vertical-align: top;
  display: inline-block;
  font-size: 13px;
  min-width: 35.5px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  border: 0;

&[disabled] {
   color: #c0c4cc;
   cursor: not-allowed;
 }

&.active {
   cursor: not-allowed;
   background-color: #409eff;
   color: #fff;
 }
}
}
</style>