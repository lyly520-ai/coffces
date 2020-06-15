<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-arrow :fixed="true" @click-left="back" />

    <div class="pay-content">
      <!-- 选择收货地址 -->
      <div class="receive" @click="showActionSheet">
        <van-icon name="location-o" size="20" />
        {{addressData.address}}
        </div>

      <!-- 订单内容 -->
      <div class="order-content">
        <div class="order-item">
          <van-card
            :num="item.count"
            :price="item.price"
            :title="item.name"
            :desc="item.enname"
            :thumb="item.small_img"
            v-for="(item, index) in orderData"
            :key="index"
          >
            <template #tags>
              <van-tag plain>{{item.rule}}</van-tag>
            </template>
          </van-card>

          <div class="clearfix">
            <div class="fr clearfix item">
              <span class="fl text">共计 {{orderDesc.count}} 件商品 合计：</span>
              <span class="fl price">￥{{orderDesc.total}}</span>
            </div>
          </div>
          <div class="item bottom-item"></div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="isShow" title="选择收货地址">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        :switchable="true"
        @select="selectAddress"
        @add="newAddress"
      >
      </van-address-list>
    </van-action-sheet>

    <van-submit-bar
     :price="orderDesc.total * 100"
      button-text="立即结算" 
      button-type="info"
     @submit="pay" />
  </div>
</template>

<script>
import { utlis } from "../utlis/utlis";

import { mapState } from "vuex";
   export default {
    name: 'Pay',

    data() {
      return {
        isShow: false,
        chosenAddressId: '0'
      };
    },

    created() {

      this.$store.commit('payModule/emptyData');

      //截取查询查询参数
      let sids = this.$route.query.sids.split('-');
      

      this.$store.commit('payModule/changeData', {key: 'sids', value: sids});

      this.findBuyProduct(sids);
      this.getAddress();

    },

    computed: {
      ...mapState('payModule', ['orderData', 'orderDesc', 'isSelect', 'list', 'addressData', 'sids'])
    },

    methods: {

      //根据sid查询需要购买的商品
      findBuyProduct(sids) {
        let tokenString = localStorage.getItem('_t');
        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });
        this.axios({
          type: 'GET',
          url: '/commitShopcart',
          params: {
            appkey: this.appkey,
            tokenString,
            sids: JSON.stringify(sids)
          }
        }).then(result => {
          this.$toast.clear();
          

          this.orderDesc.count = 0;
          this.orderDesc.total = 0;

          result.data.result.forEach(v => {
            this.orderDesc.count += v.count;

            this.orderDesc.total += v.count * v.price;
          })

          this.$store.commit('payModule/changeData', {key: 'orderData', value: result.data.result});

        }).catch(err => {
           this.$toast.clear();
          
        })
      },

      //返回上一级
      back() {
        this.$router.go(-1);
      },

      //获取收货地址
      getAddress() {
        let tokenString = localStorage.getItem('_t');
        this.axios({
          method: 'GET',
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          
          let list = [];
          result.data.result.forEach((v, i) => {
            
            let address = {
              id: i + '',
              name: v.name,
              tel: v.tel,
              address: v.province + v.city + v.county + v.addressDetail
            };

            list.push(address);

            if (v.isDefault == 1) {
              this.$store.commit('payModule/changeData', {key: 'isSelect', value: true});
              this.addressData.address = address.address;
              this.chosenAddressId = i + '';
            }

          })

          this.$store.commit('payModule/changeData', {key: 'list', value: list});

        }).catch(err => {
          
        })
      },

      //选择地址
      selectAddress(item, index) {

        if (!this.isSelect) {
          this.$store.commit('payModule/changeData', {key: 'isSelect', value: true});
        }

        this.addressData.phone = item.tel;
        this.addressData.receiver = item.name;
        this.addressData.address = item.address;

        this.isShow = false;
      },

      //新增地址
      newAddress() {
        this.$router.push({name: 'NewAddress', query: {isAdd: 1}});
      },

      showActionSheet() {
        this.isShow = true;
      },

      //结算
      pay() {
        
        if (!this.isSelect) {
          this.$toast(this.address);
          return;
        }

        let tokenString = localStorage.getItem('_t');

        let sids = this.sids.concat();

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });


        this.axios({
          method: 'POST',
          url: '/pay',
          data: {
            appkey: this.appkey,
            tokenString,
            sids: JSON.stringify(sids),
            phone: this.addressData.phone,
            receiver: this.addressData.receiver,
            address: this.addressData.address
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          this.$toast.clear();
          
          this.$router.push({name: 'Order'});
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>
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
.pay {
  padding-top: 46px;
  .content {
    padding: 10px;
  }
  .auto-img {
    width: 100%;
    display: block;
  }
  .receive {
    background-color: #fafafa;
    font-size: 16px;
    color: #333;
    height: 46px;
    line-height: 46px;
    margin: 5px 5px;
    padding: 0 20px;
    border-radius: 10px;

  }
  .order-content {
    margin: 10px 5px;
    background-color: #fafafa;
  }
  .order-item {
    border-radius: 5px;
    overflow: hidden;
  }
  .item {
    padding: 10px;
  }
  .pro-count {
    font-size: 10px;
    color: #a8a8a8;
    height: 16px;
    line-height: 16px;
    text-align: right;
  }
  .text {
    color: #999;
    font-size: 10px;
    line-height: 21px;
  }
  .price {
    font-size: 16px;
    font-weight: bold;
    color: #ee0a24;
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
  .van-submit-bar__price {
    color: #ee0a24;
    font-weight: bold;
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

  /deep/ .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #984e0d;
    border-color: #984e0d;
  }

  /deep/ .van-button--danger {
    background-color: #984e0d;
    border-color: #984e0d;
  }
  /deep/ .van-button--info {
    background-color: #996c33;
    border: 1px solid #996c33;
  }

  /deep/ .van-tag--danger {
    background-color: #984e0d;
  }

  /deep/ .van-icon-edit::before {
    content: "";
  }

  /deep/ .van-address-item__value {
    padding-right: 0;
  }
  /deep/ .van-card {
    padding: 0;
    margin: 10px 20px 20px 20px;
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
  .van-tag--plain {
    background-color: #fafafa;
    margin: 5px -5px;
  }
  /deep/ [class*="van-hairline"]::after {
    border: none;
  }
}
</style>
