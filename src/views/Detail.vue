<template>
  <div class="detail">
    <van-nav-bar title="商品详情" left-arrow :fixed="true" @click-left="back" />

    <div class="product-box">
      <div>
        <img class="auto-img" :src="productDetailData.large_img" alt />
      </div>
      <div class="box">
        <ul class="pro-box">
          <li class="pro-name">{{ productDetailData.name }}</li>
          <li class="pro-like" :class="{ active: isLike }" @click="like"></li>
        </ul>

        <!-- 价格数量 -->
        <div class="pro-price-count">
          <div class="price">￥{{ productDetailData.price }}</div>
          <div class="count clearfix">
            <span class="icon fl left" @click="decrease"></span>
            <input class="pro-count fl" type="tex" v-model="count" readonly />
            <span class="icon fl right" @click="increase"></span>
          </div>
        </div>

        <!-- 商品规格 -->
        <div class="pro-rule">
          <div class="rule-item" v-for="(item, index) in rules" :key="index">
            <span class="fl rule-title">{{ item.title }}</span>
            <ul class="fl rule-list">
              <li
                v-for="(value, i) in item.rule"
                :key="i"
                :class="{ active: value.isActive }"
                @click="toggleRule(value, index)"
              >
                {{ value.text }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 商品描述 -->
        <div class="pro-desc">
          <div class="desc-title">商品描述</div>
          <div class="desc-info">
            <p v-for="(item, index) in desc" :key="index">{{ item }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部购物车 -->
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        :badge="
          shopcartTotal == 0 ? '' : shopcartTotal >= 100 ? '99+' : shopcartTotal
        "
       @click="goPage"
      />
      <van-goods-action-button
        color="#996c33"
        type="warning"
        text="加入购物车"
        @click="addShopcart"
      />
      <van-goods-action-button
        color="#706b68"
        type="danger"
        text="立即购买"
        @click="buy"
      />
    </van-goods-action>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { utlis } from "../utlis/utlis";

export default {
  name: "Detail",

  computed: {
    ...mapState("detailModule", [
      "productDetailData",
      "rules",
      "desc",
      "count",
      "isLike",
      "shopcartTotal"
    ])
  },

  created() {
    //加载提示
    this.$toast.loading({
      forbidClick: true,
      duration: 0,
      message: "加载中..."
    });

    //清空state
    this.$store.commit("detailModule/emptyData");

    //截取路由参数
    let pid = this.$route.params.pid;
    

    //获取商品详情信息
    this.axios({
      method: "GET",
      url: "/productDetail",
      params: {
        appkey: this.appkey,
        pid
      }
    })
      .then(result => {
        
        if (result.data.code == 600) {
          this.$store.commit(
            "detailModule/changeProductDetailData",
            result.data.result[0]
          );

          //查看收藏商品
          this.findlike();

          //获取商品总数量
          this.shopcartRows();


          //关闭加载提示
          this.$toast.clear();
        }
      })
      .catch(err => {
        
        //关闭加载提示
        this.$toast.clear();
      });
  },

  methods: {
    //增加数量
    increase() {
      let count = this.count + 1;
      this.$store.commit("detailModule/changeData", {
        key: "count",
        value: count
      });
    },

    //减少数量
    decrease() {
      if (this.count == 1) {
        return;
      }

      let count = this.count - 1;

      this.$store.commit("detailModule/changeData", {
        key: "count",
        value: count
      });
    },

    //切换商品规格
    toggleRule(item, index) {
      
      if (item.isActive) {
        
        return;
      }

      let cuurentRule = this.rules[index];
      
      for (let i = 0; i < cuurentRule.rule.length; i++) {
        if (cuurentRule.rule[i].isActive) {
          cuurentRule.rule[i].isActive = false;
          break;
        }
      }

      item.isActive = true;
    },

    //查看当前商品是否被收藏
    findlike() {
      let tokenString = localStorage.getItem('_t');
      

      if (tokenString == null) {
        return;
      }

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.productDetailData.pid,
          tokenString
        }
      })
        .then(result => {
          

         if(result.data.code == 1000) {
            //修改isLike
            this.$store.commit("detailModule/changeData", {
              key: "isLike",
              value: result.data.result.length > 0
            });
          }
        })
        .catch(err => {
          
        });
    },

    //收藏商品, 取消收藏
    like() {
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      let tokenString = localStorage.getItem('_t');

      let url = this.isLike ? "/notlike" : "/like";

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.productDetailData.pid,
          tokenString
        },

        transformRequest: utlis.transformRequest
      })
        .then(result => {
          //关闭加载提示
          this.$toast.clear();

          

          if (result.data.code == 700) {
            this.$router.push({name: 'Login'});
            return;
          }

          //加载提示
          this.$toast({
            message: result.data.msg
          });
          //修改isLike
          this.$store.commit("detailModule/changeData", {
            key: "isLike",
            value: !this.isLike
          });
        })
        .catch(err => {
          
          //关闭加载提示
          this.$toast.clear();
        });
    },

    //加入购物车
    addShopcart(type) {
      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });
      let tokenString = localStorage.getItem('_t');

      //获取商品规格
      

      let ruleData = [];
      this.rules.forEach(v => {
        for (let i = 0; i < v.rule.length; i++) {
          if (v.rule[i].isActive) {
            ruleData.push(v.rule[i].text);
            break;
          }
        }
      });

      

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.productDetailData.pid,
          count: this.count,
          rule: ruleData.join("/"),
          tokenString
        },
        transformRequest: utlis.transformRequest
      })
        .then(result => {
          //关闭加载提示
          this.$toast.clear();
          

          //未登录，跳到登录界面
          if (result.data.code == 700) {
            this.$router.push({name: 'Login'});
            return;
          }

          //加载提示
          this.$toast({
            message: result.data.msg
          });

          if (result.data.code == 3000) {

            if (result.data.status == 1) {
              //新增一条数据
              this.$store.commit("detailModule/changeData", {
                key: "shopcartTotal",
                value: this.shopcartTotal + 1
              });
            }

            //如果是立即购买，则跳转到结算页面，携带sid到立即结算页面
            if (type == 'buy') {
              this.$router.push({name: 'Pay', query: {sids: result.data.sid}});
            }
          }
        })
        .catch(err => {
          
          //关闭加载提示
          this.$toast.clear();
        });
    },

    //立即购买
    buy() {
      this.addShopcart('buy');
    },

    //获取购物车总商品数量
    shopcartRows() {
      let tokenString = localStorage.getItem('_t');
      this.axios({
        method: "GET",
        url: "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 8000) {
            this.$store.commit("detailModule/changeData", {
              key: "shopcartTotal",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          
        });
    },

    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //跳转
    goPage() {
      this.$router.push({name: 'Shopcart'});
    }
  }
};
</script>

<style lang="less" scoped>
.detail {
  padding-bottom: 80px;
  padding-top: 46px;
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
  .van-nav-bar {
    background-color: #644f3e;
    /deep/ .van-icon {
      color: white;
    }
    /deep/ .van-nav-bar__title {
      color: white;
    }
  }
  .auto-img {
    width: 100%;
    display: block;
  }
  .box {
    padding: 0 20px;
    .pro-box {
      display: flex;
      padding-top: 20px;
    }
    .pro-name {
      font-size: 18px;
      color: #984e0d;
      line-height: 24px;
    }
    .pro-like {
      margin-left: auto;
      width: 34px;
      height: 32px;
      background: url("../assets/images/like.png") no-repeat;
      background-size: cover;
      &.active {
        background-image: url("../assets/images/like-active.png");
      }
    }
    .pro-rule {
      margin-top: 20px;
      border-bottom: 1px solid #979694;
      margin-bottom: 4px;
      .rule-item {
        height: 30px;
        padding: 10px 0;
      }
      .rule-title {
        width: 60px;
        line-height: 30px;
        font-size: 16px;
        color: #74706f;
      }
      .rule-list > li {
        float: left;
        width: 70px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        color: white;
        background-color: #7a7b7d;
        margin-right: 20px;
        border-radius: 20px;
        &.active {
          background-color: #984e0d;
        }
      }
    }
    .pro-desc {
      margin-top: 20px;
      padding-bottom: 20px;
      .desc-title {
        color: #525250;
        font-size: 16px;
      }
      .desc-info {
        color: #e28945;
        font-size: 14px;
        > p {
          margin: 10px 0 0;
        }
      }
    }
    .pro-price-count {
      display: flex;
      margin-top: 20px;
      height: 50px;
      .price {
        color: red;
        font-size: 16px;
        line-height: 50px;
      }
      .count {
        border: 1px solid #323232;
        border-radius: 20px;
        text-align: center;
        margin-top: 13px;
        margin-left: auto;
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
          width: 40px;
          margin: 6px 0px;
          font-size: 20px;
          text-align: center;
        }
        .icon {
          width: 24px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          margin: 5px 5px;
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
  }
  .van-goods-action {
    .van-goods-action-icon {
      color: #a55109;
    }
  }
}
</style>
