<template>
  <div class="main">

    <!-- 二级路由插座 -->
    <router-view></router-view>

    <!-- 底部导航 -->
    <van-tabbar v-model="tabbarName">
      <van-tabbar-item :name="item.name" :icon="item.icon" v-for="(item, index) in tabbarData" :key="index" @click.native="goPage(item)">{{item.text}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'Main',

    data() {
      return {
        //底部导航索引
        tabbarName: 'home'
      };
    },

    computed: {

      tabbarData() {
        return this.$store.state.mainModule.tabbarData;
      }
    },
    methods: {
      //跳转
      goPage(item) {
        
        this.$router.push({name: item.routeName});
      }
    }
  }
</script>

<style lang="less">
body{
  padding: 0;
  margin: 0;
}
.van-tabbar{
  background-color: #644f3e;
 .van-tabbar-item{
    color: white;
  }
  .van-tabbar-item--active{
    color: #c1a28d;
  }
}
</style>
