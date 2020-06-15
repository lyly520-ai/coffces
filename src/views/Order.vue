<template>
  <div class="order">
    <van-tabs
      v-model="activeName"
      color="#644f3e"
      line-height="2px"
      sticky
      @change="toggleTab"
    >
      <van-tab
        :title="item.title"
        :name="item.name"
        v-for="(item, index) in tabData"
        :key="index"
      >
        <template v-if="orderData.length > 0">
          <!-- 订单内容 -->
          <div class="order-content">
            <div
              class="order-item"
              v-for="(item1, index1) in orderData"
              :key="index1"
            >
              <div class="item">
                <div class="order-title clearfix">
                  <span class="fl order-no">{{ item1.oid }}</span>
                  <span class="fr order-text clearfix">
                    <template v-if="item1.status == 1">
                      <span
                        class="fl"
                        @click="confirmReceive(item1.oid, index1)"
                        >确认收货</span
                      >
                    </template>
                    <template v-else>
                      <span class="fl">已完成</span>
                      <span
                        class="fl delete-icon"
                        @click="removeOrder(item1.oid, index1)"
                      >
                        <van-icon name="delete" />
                      </span>
                    </template>
                  </span>
                </div>
                <!-- 订单中的单独的商品数据 -->
                <van-card
                  :num="item2.count"
                  :price="item2.price"
                  :desc="item2.enname"
                  :title="item2.name"
                  :thumb="item2.smallImg"
                  v-for="(item2, index2) in item1.data"
                  :key="index2"
                >
                  <template #tags>
                    <van-tag>{{ item2.rule }}</van-tag>
                  </template>
                </van-card>
              </div>
              <div class="item clearfix">
                <div class="fl order-text order-time">
                  {{ item1.orderTime }}
                </div>
                <div class="fr clearfix">
                  <span class="fl text"
                    >共计{{ item1.count }}件商品 合计：</span
                  >
                  <span class="fl price">￥{{ item1.total }}</span>
                </div>
              </div>
              <div class="item bottom-item"></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="not-order">
            <div>
              <div class="not-order-icon">
                <van-icon name="description" />
              </div>
              <div v-if="isLogin">暂时没有订单，赶紧去下单！</div>
              <div v-else>
                <span class="login-text" @click="goState"
                  >请先登录</span
                >
              </div>
            </div>
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>

  import {mapState} from 'vuex'

  import {utlis} from '../utlis/utlis'

  export default {
    name: 'order',
    data() {
      return {
        activeName: '0'
      };
    },


    created() {

      //全部
      this.getOrder(0);

    },

    computed: {
      isLogin() {
        return this.$store.state.isLogin;
      },

      ...mapState('orderModule', ['orderData', 'tabData'])
    },

    methods: {

      goState() {
        this.$router.push({name: 'Login'});
      },

      //获取订单数据
      getOrder(status) {

        let tokenString = localStorage.getItem('_t');

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'GET',
          url: '/findOrder',
          params: {
            appkey: this.appkey,
            tokenString,
            status
          }
        }).then(result => {
          this.$toast.clear();
          

          this.$store.commit('changeData', {key: 'isLogin', value: result.data.code != 700});

          if (result.data.code == 700) {
            return;
          }

          //获取所有订单号数据
          let orderData = [];

          //查询订单oid
          let orderNos = [];
          result.data.result.forEach(v => {
            if (orderNos.indexOf(v.oid) === -1) {
              orderNos.push(v.oid);
            }
          })


          orderNos.forEach(v => {

            
            //当前订单数据
            let currentOrderData = {
              oid: v,
              count: 0,
              total: 0,
              //当前订单的所有商品数据
              data: []
            };

            result.data.result.forEach(item => {

              if (item.oid == v) {

                currentOrderData.data.push(item);

                currentOrderData.count += item.count;

                currentOrderData.total += item.count * item.price;
              }

            })


            //订单时间
            currentOrderData.orderTime = utlis.formatDate(new Date(currentOrderData.data[0].createdAt), 'yyyy-MM-dd hh:mm:ss');

            currentOrderData.status = currentOrderData.data[0].status;

            orderData.push(currentOrderData);

          })


          orderData.sort((a, b) => {
            return new Date(b.orderTime) - new Date(a.orderTime);
          })


          this.$store.commit('orderModule/changeData', {key: 'orderData', value: orderData})

          

        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //确认收货
      confirmReceive(oid, index) {

        let tokenString = localStorage.getItem('_t');

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'POST',
          url: '/receive',
          data: {
            appkey: this.appkey,
            tokenString,
            oid
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          this.$toast.clear();
          

          this.orderData[index].status = 2;

          if (this.activeName == 1) {
            //删除orderData数组的元素
            this.$store.commit('orderModule/removeOrderData', index);
          }

        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //切换标签
      toggleTab(status) {
        
        this.getOrder(status);
      },

      //删除订单
      removeOrder(oid, index) {

        let tokenString = localStorage.getItem('_t');

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'POST',
          url: '/removeOrder',
          data: {
            appkey: this.appkey,
            tokenString,
            oid
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          this.$toast.clear();
          
          //删除orderData数组的元素
          this.$store.commit('orderModule/removeOrderData', index);
        }).catch(err => {
          this.$toast.clear();
          
        })
      }

    }
  }
</script>

<style lang="less" scoped>
.auto-img {
  width: 100%;
  display: block;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.order {
  padding-bottom: 49.98px;
  .not-order {
    font-size: 18px;
    margin-top: 96px;
    color: #996c33;
    text-align: center;
  }
  .not-order-icon {
    font-size: 64px;
  }
  .login-text {
    color: #996c33;
  }
  /deep/ .van-tab {
    color: white;
  }
  /deep/.van-tabs__nav {
    background-color: #644f3e;
  }
  /deep/ .van-tab--active {
    color: #c1a28d;
  }
  .delete-icon {
    font-size: 16px;
    position: relative;
    top: 2px;
    margin-left: 10px;
  }
  .order-content {
    padding: 10px 10px 0 10px;
  }
  .order-title {
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
    line-height: 21px;
  }
  .pro-item {
    /deep/ .van-card {
      padding: 0;
      margin: 10px 20px;
    }

    /deep/ .van-card__price {
      position: absolute;
      top: 6px;
      right: -8px;
    }
    /deep/ .van-card__num {
      position: absolute;
      bottom: 12px;
      right: 0px;
    }

    /deep/ .van-card__title {
      line-height: 32px;
      font-size: 16px;
    }
  }
  /deep/ .van-tag--default {
    background-color: #fafafa;
  }
  /deep/ .van-tag {
    color: #646566;
  }
  /deep/ .van-card__price-integer {
    font-size: 12px;
  }
  .order-time {
    line-height: 21px;
  }
  .order-no {
    font-size: 12px;
    color: #969799;
  }
  .order-text {
    font: 16px;
    color: #969799;
  }
  .order-item {
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .item {
    background-color: #fafafa;
    padding: 10px;
  }
  .text {
    color: #999;
    font-size: 10px;
    line-height: 21px;
  }
  .price {
    font-size: 16px;
    font-weight: bold;
    color: #444;
  }
  .bottom-item {
    margin: -5px 5px 0;
    padding: 0;
    height: 10px;
    position: relative;
    z-index: -1;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: #fff;
  }
}
</style>
