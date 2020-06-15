<template>
  <div class="newAddress">
    <van-nav-bar title="新增地址" left-arrow :fixed="true" @click-left="back" />
    <van-address-edit
      :area-list="addressList"
      :address-info="addressInfo"
      :show-set-default="isDefault"
      :show-delete="isDelete"
      :show-postal="isPostal"
      save-button-text="保存地址"
      delete-button-text="删除地址"
      detail-rows="2"
      detail-maxlength="50"
      @save="saveAddress"
      @delete="deleteAddress"
    />
  </div>
</template>

<script>

  import {mapState} from 'vuex'

  import {utlis} from '../utlis/utlis'

  export default {
    name: 'NewAddress',

    data() {
      return {
        //初始化组件地址内容，编辑地址需要用到, 编辑地址需要aid
        addressInfo: {
          aid: '',
          name: '',
          tel: '',
          province: '',
          city: '',
          county: '',
          addressDetail: '',
          areaCode: '',
          postalCode: '',
          isDefault: false
        }
      };
    },

    created() {

      //截取查询数据
      let query = this.$route.query;

      //根据地址aid获取地址数据
      if (query.isAdd == 0) {
        let tokenString = localStorage.getItem('_t');

        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'GET',
          url: '/findAddressByAid',
          params: {
            appkey: this.appkey,
            tokenString,
            aid: query.aid
          }
        }).then(result => {
          this.$toast.clear();
          
          let data = result.data.result[0];
          data.isDefault = Boolean(data.isDefault);

          for (let key in this.addressInfo) {
            this.addressInfo[key] = data[key];
          }

          //拷贝地址数据
          let addressData = Object.assign({}, this.addressInfo);

          this.$store.commit('newAddressModule/changeData', {key: 'temporaryAddressData', value: addressData});
        }).catch(err => {
          this.$toast.clear();
          
        })
      }

      this.$store.commit('newAddressModule/changeData', {key: 'isAdd', value: query.isAdd});

      this.$store.commit('newAddressModule/changeData', {key: 'aid', value: query.aid});

      this.$store.commit('newAddressModule/changeData', {key: 'isDelete', value: !query.isAdd});

      this.$store.commit('newAddressModule/changeData', {key: 'title', value: query.isAdd == 0 ? '编辑地址' : '新增地址'});

    },

    computed: {
      ...mapState('newAddressModule', ['isAdd', 'aid', 'isDefault', 'isDelete', 'isPostal', 'addressList', 'title', 'temporaryAddressData'])
    },

    methods: {
      //返回上一级
      back() {
        this.$router.go(-1);
      },

      //判断当前(编辑后)地址数据和编辑前的地址数据是否一样
      isSame(o1, o2) {
        //o1: 当前地址数据
        //o2: 编辑前的地址数据

        for (let key in o2) {
          if (o2[key] != o1[key]) {
            //存在数据不一样
            return false;
          }
        }

        return true;

      },

      //保存地址
      saveAddress(addressContent) {
        //addressContent: 地址内容
        

        
        delete addressContent.country;

        //拷贝对象
        let data = Object.assign({}, addressContent);

        let url = '';
        if (this.isAdd == 1) {
          //新增地址
          delete data.aid;
          url = '/addAddress';
        } else {
          //编辑地址
          //先判断当前地址数据和编辑前的地址数据是否一样,如果数据一样，则不请求
          if (this.isSame(addressContent, this.temporaryAddressData)) {
            
            return this.$router.push({name: 'Address'});
          }else {
            //数据不一样，发起请求
            url = '/editAddress';
          }
        }

        //获取token字符串
        let tokenString = localStorage.getItem('_t');
        data.tokenString = tokenString;
        data.appkey = this.appkey;

        //将isDefault转为number
        data.isDefault = Number(data.isDefault);

        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'POST',
          url,
          data,
          transformRequest: utlis.transformRequest
        }).then(result => {
          // 
          this.$toast.clear();

          // this.$router.push({name: 'Address'});

          this.back()
        }).catch(err => {
          
          this.$toast.clear();
        })


      },

      //删除地址
      deleteAddress() {
 
        let tokenString = localStorage.getItem('_t');

        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'POST',
          url: '/deleteAddress',
          data: {
            appkey: this.appkey,
            tokenString,
            aid: this.aid
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          this.$toast.clear();
          
          this.$router.push({name: 'Address'});
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.newAddress {
  padding-top: 46px;
  .van-nav-bar {
    background-color: #644f3e;
    /deep/ .van-icon {
      color: white;
    }
    /deep/ .van-nav-bar__title {
      color: white;
    }
  }
  /deep/ .van-button--danger{
      background-color: #984e0d;
      border-color: #984e0d;
    }
    /deep/ .van-switch--on{
        background-color: #984e0d;
    }
    /deep/ .van-button--default{
        background-color: #928e8d;
        color: white;
    }
}
</style>
