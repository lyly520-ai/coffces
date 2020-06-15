<template>
  <div class="menu">
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="5000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in bannerData" :key="index">
        <img class="auto-img" :src="item.bannerImg" alt="" />
      </van-swipe-item>
    </van-swipe>
    <!-- 轮播图 end -->
    <!-- 菜单分类 -->
    <div class="menu-data">
      <div class="aside">
        <div
          class="aside-item"
          :class="{ active: item.isActive }"
          v-for="(item, index) in typeData"
          :key="index"
          @click="toggleType(item, index,$event)"
        >
          {{ item.typeDesc }}
        </div>
        <div class="line" :style="{ top: top + 'px' }"></div>
      </div>
      <div class="content">
        <div class="content-item" v-for="(item,index) in currentProduct" :key="index" @click="goDetail(item.pid)">
          <div class="pro-img">
            <img class="auto-img" :src="item.smallImg" alt="" />
          </div>
          <div class="pro-desc">
            <div class="pro-name">
              <div class="ch-name">{{item.name}}</div>
              <div class="en-name">{{item.enname}}</div>
            </div>
            <div class="price-title">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 菜单分类end -->
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: "Menu",

  created() {

    if(this.menuIsLoaded){
      //不再请求
      return;
    }
    
    //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中...",
      });

    //初始化页面数据
    //获取banner数据
    this.getBanner();

    //获取商品数据类型
    this.getType();

    this.$store.commit('changeData',{key:'menuIsLoaded',value:true})
  },

  computed: {
    //菜单页面是否加载过
    menuIsLoaded(){
      return this.$store.state.menuIsLoaded;
    },
    // 轮播图数据
    // bannerData

    //商品类型数据
    // typeData

    //线条移动的距离
    // top

    //当前数据类型商品
    // currentProduct

    ...mapState('menuModule',['bannerData','typeData','top','currentProduct'])
  },
  methods: {
    //获取banner图
    getBanner() {
      this.axios({
        method: "GET",
        url: "/banner",

        //请求携带的参数
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          // 
          if (result.data.code == 300) {
            this.$store.commit('menuModule/changeData',{key:'bannerData',value:result.data.result});
          }
          // 
        })
        .catch(ree => {
          
        });
    },
    getType() {
      this.axios({
        method: "GET",
        url: "/type",

        //请求携带的参数
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          

          let types = result.data.result;
          //添加 isActive  用于判断激活的标签

          types.forEach(v => {
            v.isActive = false;
          });

          types.unshift({
            type: "isHot",
            typeDesc: "店长推荐",
            isActive: true
          });

          if (result.data.code == 400) {
            this.$store.commit('menuModule/changeData',{key:'typeData',value:types});

            //获取店长推荐商品数据
            this.getTypeProduct(this.typeData[0]);
          }
          // 
        })
        .catch(ree => {
          
        });
    },
    //切换商品类型
    toggleType(item, index,e) {
      if (item.isActive) {
        return;
      }
      let types = this.typeData.concat();
      for (let i = 0; i < types.length; i++) {
        if (types[i].isActive) {
          types[i].isActive = false;
          break;
        }
      }

      //将当前激活
      types[index].isActive = true;

      this.$store.commit('menuModule/changeData',{key:'typeData',value:types});
   
   
       this.$store.commit('menuModule/changeData',{key:'top',value:index * e.target.clientHeight});
 
 
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中...",
      });


      this.getTypeProduct(item);
    },

    //获取商品类型数据
    getTypeProduct(item){

      // 
      //请求参数
      let params = {
        appkey:this.appkey
      };

      if(item.type == 'isHot'){
        params.value = 1;
        params.key = 'isHot';
      } else{
        params.value = item.type;
        params.key = 'type';
      }

      this.axios({
        method:'GET',
        url:'/typeProducts',
        params
      }).then(result => {

        //关闭加载提示
          this.$toast.clear();
          // 

        // 
        if(result.data.code == 500){
          this.$store.commit('menuModule/changeData',{key:'currentProduct',value:result.data.result});

          
        }

      }).catch(err => {
        
        //关闭加载提示
          this.$toast.clear();
          // 
      })
    },

    //携带商品pid 跳转详情页
    goDetail(pid){
      this.$router.push({name:'Detail',params:{pid}})
    }
  }
}
</script>

<style lang="less" scoped>
.menu {
  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    text-align: center;
    .auto-img {
      width: 100%;
      height: 188px;
    }
  }
  .menu-data {
    display: flex;
    position: fixed;
    top: 188px;
    bottom: 50px;
    left: 0;
    right: 0;
    .aside {
      width: 80px;
      background-color: #88512e;
      font-size: 14px;
      .line {
        position: absolute;
        top: 0;
        left: 0px;
        width: 3px;
        height: 40px;
        background-color: white;
        transition: top 0.2s;
      }
      .aside-item {
        text-align: center;
        line-height: 40px;
        color: black;
        &.active {
          background-color: #8b7e75;
          color: white;
        }
      }
    }
    .content {
      width: calc(~"100% - 80px");
      background-color: #8b7e75;
      height: 100%;
      overflow-y: auto;
      .content-item:nth-child(2n) {
        float: right;
        margin-right: 5px;
      }
      .content-item:nth-child(n) {
        float: left;
        margin-left: 5px;
      }
      .content-item {
        width: 46%;
        text-align: center;
        margin: 10px 0px;
        .pro-img {
          > img {
            width: 120px;
            height: 120px;
            border-radius: 10px;
          }
        }
        .pro-desc {
          width: 100%;
          .pro-name {
            height: 60px;
            .ch-name {
              font-size: 18px;
              color: white;
            }
            .en-name {
              width: 100%;
              font-size: 14px;
              color: white;
            }
          }
          .price-title {
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            color: white;
          }
        }
      }
    }
  }
}
</style>
