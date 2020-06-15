<template>
  <div class="shopcart">
    <van-nav-bar
      title="购物车"
      :fixed="true"
      :right-text="isManage ? '完成' : '编辑'"
      @click-right="manage"
    />
     <template v-if="allShocartData.length > 0">
    <div class="shopcart-box">
      <van-list
        finished-text="没有更多数据了"
        :finished="isFinished"
        v-model="isLoading"
        @load="loadData"
      >
        <van-swipe-cell
          v-for="(item, index) in shopcartData"
          :key="index"
          :disabled="!isManage"
        >
          <div class="content-item">
            <div class="shopcart-checkbox">
              <van-checkbox
                v-model="item.isChecked"
                @change="simpleSelect(item)"
              >
              </van-checkbox>
            </div>
            <div class="pro-img" @click="goPage(item.pid)">
              <img class="auto-img" :src="item.small_img" alt="" />
            </div>
            <div class="pro-desc">
              <div class="pro-name">
                <div class="ch-name">{{ item.name }}</div>
                <div class="en-name">{{ item.enname }}</div>
              </div>
              <div class="rule">{{ item.rule }}</div>
              <div class="pro-price">￥{{ item.price }}</div>
            </div>
            <div class="count clearfix">
              <span class="icon fl left" @click="decrease(item)"></span>
              <input
                class="pro-count fl"
                type="text"
                readonly
                v-model="item.count"
              />
              <span class="icon fl right" @click="increase(item)"></span>
            </div>
          </div>
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button v-btn"
              @click="removeOneShopcart(item.sid, index)"
            />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
    <!-- 结算页面 -->
    <van-submit-bar
      :price="total"
      button-text="提交订单"
      button-type="info"
      :safe-area-inset-bottom="true"
      v-show="!isManage"
      @submit="commit"
    >
      <van-checkbox v-model="isAllSelect" @click="allSelect">全选</van-checkbox>
    </van-submit-bar>

    <!-- 删除 -->
    <van-submit-bar
      class="v-submit"
      button-text="删除"
      button-type="info"
      :safe-area-inset-bottom="true"
      v-show="isManage"
      @submit="removeMoreShopcart"
    >
      <van-checkbox v-model="isAllSelect"  @click="allSelect">全选</van-checkbox>
    </van-submit-bar>
  </template>
     <template v-else>
       <div>
         <div class="not-shopcart">
          <div class="not-shopcart-icon">
            <van-icon name="cart-o" />
          </div>
          <div v-if="isLogin">没有商品，赶紧去逛一逛！</div>
          <div v-else>
            <span class="login-text" @click="goState">请先登录</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { utlis } from "../utlis/utlis";

  export default {
    name: 'Shopcart',
    data() {
      return {
        //触底加载提示
        isLoading: false,

        //全选
        isAllSelect: false
      };
    },
    created() {

      this.$store.commit('shopcartModule/emptyData');

      //获取购物车所有商品
      this.getAllShopcartProduct();
    },
    computed: {
      isLogin() {
        return this.$store.state.isLogin;
      },

      ...mapState('shopcartModule', ['allShocartData', 'shopcartData', 'isFinished', 'count', 'isManage', 'total'])
    },
    methods: {

      goState() {
        this.$router.push({name: 'Login'});
      },

      //查看详情
      goPage(pid) {
        this.$router.push({name: 'Detail', params: {pid}});
      },

      //获取购物车所有商品
      getAllShopcartProduct() {

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '加载中...'
        })

        //获取token字符串
        let tokenString = localStorage.getItem('_t');

        this.axios({
          method: 'GET',
          url: '/findAllShopcart',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          
          this.$toast.clear();

          this.$store.commit('changeData', {key: 'isLogin', value: result.data.code != 700});

          if (result.data.code == 700) {
            return;
          }

          if (result.data.code == 5000) {

            //添加判断勾选的属性
            result.data.result.forEach(v => {
              v.isChecked = false;
            })

            this.$store.commit('shopcartModule/changeData', {key: 'allShocartData', value: result.data.result});

          }
        }).catch(err => {
           this.$toast.clear();
          
        })
      },

      //加载商品数据
      loadData() {
        setTimeout(() => {
          
          this.isLoading = false;

          if (this.shopcartData.length >= this.allShocartData.length) {
            
            //没有数据可加载
             this.$store.commit('shopcartModule/changeData', {key: 'isFinished', value: true});

             return;
          }
         
          this.$store.commit('shopcartModule/loadShopcartData');
          this.isAllSelect = false;
          
        }, 1000)
        
      },

      //修改购物车商品数量
      modifyShopcartCount(sid, count) {
        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '处理中...'
        })
        //获取token字符串
        let tokenString = localStorage.getItem('_t');

        this.axios({
          method: 'POST',
          url: '/modifyShopcartCount',
          data: {
            appkey: this.appkey,
            tokenString,
            sid,
            count
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          this.$toast.clear();
          
           this.sum();
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //增加商品数量
      increase(item) {
        // 
        ++item.count;

        this.modifyShopcartCount(item.sid, item.count);
      },

      //减少数量
      decrease(item) {
        if (item.count == 1) {
          return;
        }

        --item.count;

        this.modifyShopcartCount(item.sid, item.count);
      },

      //管理商品
      manage() {
        this.$store.commit('shopcartModule/changeData', {key: 'isManage', value: !this.isManage})
      },

      //全选
      allSelect() {
        this.shopcartData.forEach(v => {
          v.isChecked = !this.isAllSelect;
        })
      },

      //单选
      simpleSelect(item) {
       
       

       this.sum();

       if (!item.isChecked) {
         //没有全选
         this.isAllSelect = false;
         return;
       }

       for (let i = 0; i < this.shopcartData.length; i++) {
         if (!this.shopcartData[i].isChecked) {
           //没有全选
          this.isAllSelect = false;
          return;
         }
       }

       this.isAllSelect = true;

      },

      //删除单个商品
      removeOneShopcart(sid, index) {
        let sids = JSON.stringify([sid]);
        
        this.removeShopcart(sids).then(result => {
          this.$toast.clear();
          
          this.$store.commit('shopcartModule/removeShopcartData', [sid]);
           this.sum();
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //删除多个商品
      removeMoreShopcart() {

        //获取勾选的商品
        let sids = [];
        this.shopcartData.forEach(v => {
          if (v.isChecked) {
            sids.push(v.sid);
          }
        })

        if (sids.length == 0) {
          this.$toast({
            message: '没有选择商品'
          })
          return;
        }

        // 
        this.removeShopcart(JSON.stringify(sids)).then(result => {
          this.$toast.clear();
          
          this.$store.commit('shopcartModule/removeShopcartData', sids);
           this.sum();
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //删除商品
      removeShopcart(sids) {
         //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '处理中...'
        })
        //获取token字符串
        let tokenString = localStorage.getItem('_t');

        return this.axios({
          method: 'POST',
          url: '/deleteShopcart',
          data: {
            appkey: this.appkey,
            tokenString,
            sids
          },
          transformRequest: utlis.transformRequest
        })
      },

      //计算订单总价
      sum() {
        
        let total = 0;
        this.shopcartData.forEach(v => {
          if (v.isChecked) {
            total += v.price * v.count * 100;
          }
        })

        this.$store.commit('shopcartModule/changeData', {key: 'total', value: total});
      },

      //提交订单 
      commit() {
        // 获取勾选商品的购物车的sid
        let sids = []
        this.shopcartData.forEach(v => {
          if (v.isChecked) {
            sids.push(v.sid);
          }
        })

        this.$router.push({name: 'Pay', query: {sids: sids.join('-')}});
      }

    }
  };
</script>

<style lang="less" scoped>
.shopcart {
  padding-top: 46px;
  padding-bottom: 110px;
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .clearfix {
    content: "";
    display: block;
    clear: both;
  }
  .auto-img {
    width: 100%;
    display: block;
    border-radius: 10px;
  }
   .not-shopcart{
      font-size: 18px;
      margin-top: 50px;
      color:#996c33;
      text-align: center;
    }
    .not-shopcart-icon{
      font-size: 64px;
    }

    .login-text{
      color: #996c33;
    }
  .van-nav-bar {
    background-color: #644f3e;
    /deep/ .van-nav-bar__title {
      color: white;
      font-size: 18px;
    }
    /deep/ .van-nav-bar__text {
      color: white;
      font-size: 18px;
    }
  }
  .v-submit {
    .van-checkbox {
      margin-right: auto;
    }
  }
  .shopcart-box {
    .content-item {
      height: 100px;
      display: flex;
      padding: 10px;
      margin: 10px 0;
      border-bottom: 1px solid #f0f0f0;
      position: relative;
      .shopcart-checkbox {
        margin-top: 29px;
        margin-right: 10px;
      }
      .pro-img {
        width: 80px;
      }
      .pro-desc {
        width: calc(~"100% - 80px - 10px -28px");
        margin-left: 10px;
      }

      .pro-name {
        height: 54px;
      }
      .pro-price {
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        color: red;
      }
      .rule {
        font-size: 14px;
        margin-bottom: 5px;
      }
      .ch-name {
        font-size: 18px;
        color: #444;
      }
      .en-name {
        font-size: 14px;
        color: #c2c2c2;
      }
      .count {
        border: 1px solid #323232;
        border-radius: 20px;
        text-align: center;
        margin-left: auto;
        position: absolute;
        bottom: 8px;
        right: 20px;
        > input {
          border-top: none;
          border-bottom: none;
          border-left: 2px solid #797979;
          border-right: 2px solid #797979;
          padding: 0;
          outline: none;
          margin: 5px auto;
        }
        .pro-count {
          height: 24px;
          width: 30px;
          margin: 2px 0px;
          font-size: 20px;
          text-align: center;
        }
        .icon {
          width: 16px;
          height: 16px;
          text-align: center;
          line-height: 16px;
          margin: 6px 5px;
          border-radius: 50%;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
          &.left {
            background-image: url("../assets/images/reduce.png");
          }
          &.right {
            background-image: url("../assets/images/increase.png");
          }
        }
      }
    }
    .v-btn {
      height: 100%;
    }
  }
  .van-submit-bar {
    bottom: 50px;
  }
  /deep/ .van-checkbox__icon--checked .van-icon {
    background-color: #984e0d;
    border-color: #984e0d;
  }
  /deep/ .van-button--info {
    background-color: #984e0d;
  }
}
</style>
