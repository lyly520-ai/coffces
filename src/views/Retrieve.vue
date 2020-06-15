<template>
  <div class="retrieve">
    <van-nav-bar title="找回密码"  left-arrow :fixed="true" @click-left="back" />

    <van-form @submit="commit">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="11位手机号"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.password"
        type="text"
        name="新密码"
        label="新密码"
        placeholder="密码(6-16个字符)"
        autocomplete="off"
      />
      <div class="btn-box">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>

  </div>
</template>

<script>

  //导入表单验证模块
  import {valid} from '../utlis/valid'

  import { utlis } from '../utlis/utlis'

  export default {
    name: 'Retrieve',

    data() {
      return {
        userInfo: {
          phone: '',
          password: ''
        }
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      commit() {

        //表单验证
        if (valid.validForm(this.userInfo, this)) {
          //验证通过

          //加载提示
          this.$toast.loading({
            forbidClick: true,
            duration: 0,
            message: "加载中..."
          });

          this.axios({
            method: 'POST',
            url: '/retrievePassword',
            data: {
              appkey: this.appkey,
              phone: this.userInfo.phone,
              password: this.userInfo.password
            },
            transformRequest: utlis.transformRequest
          }).then(result => {
            this.$toast.clear();
            
            if (result.data.code == 'L001') {
              this.$router.push({name: 'Login'});
            } else {
              this.$toast(result.data.msg);
            }
            
          }).catch(err => {
            this.$toast.clear();
            
          })

        }

      }
    }
  }
</script>

<style lang="less" scoped>
  .retrieve{
     padding-top: 96px;
    width: 100%;
  height: 621px;
  background-color: #f2efea;
    .btn-box{
      margin-top: 16px;
      padding: 0 10px;
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
  .van-button--info{
        background-color: #996c33;
    border: 0.02667rem solid #996c33;
  }
  }
</style>