<template>
  <div>
    <!-- 一级路由插座 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" scoped>
  body{
    margin: 0 auto;
  }
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .auto-img{
    width: 100%;
    display: block;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix::after{
    content: '';
    display: block;
    clear: both;
  }
</style>
