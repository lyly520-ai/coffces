<template>
  <div class="email">
        <van-nav-bar
      title="邮箱验证"
      left-arrow
      :fixed="true"
      @click-left="back"
    />

    <van-form @submit="next">
      <van-field
        v-model="userInfo.email"
        name="邮箱"
        label="邮箱"
        placeholder="请输入邮箱"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.validCode"
        center
        clearable
        label="邮箱验证码"
        placeholder="请输入邮箱验证码"
        autocomplete="off"
        maxlength="6"
      >
      <template #button>
        <van-button :disabled="userInfo.isSend" size="small" type="info" @click.prevent="sendValidCode">{{userInfo.text}}</van-button>
      </template>
    </van-field>
      <div class="btn-box">
        <van-button round block type="info" native-type="submit">下一步</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>

  //导入表单验证模块
  import {valid} from '../utlis/valid'

  import { utlis } from '../utlis/utlis'

  export default {
    name: 'Email',

    data() {
      return {
        userInfo: {
          email: '',
          validCode: '',
          isSend: false,
          text: '发送验证码'
        }
      }
    },

    methods: {
      back() {
        this.$router.go(-1);
      },

      //发送验证码
      sendValidCode() {
        //判断邮箱是否正确
        if (valid.validForm({email: this.userInfo.email}, this)) {

          

          let time = 60;

          this.userInfo.isSend = true;
          this.userInfo.text = `${time}s后重新发送`;

          let timer = setInterval(() => {

            if (time == 0) {
              clearInterval(timer);
              timer = null;
              this.userInfo.isSend = false;
              this.userInfo.text = '发送验证码';
            } else {
              time--;
              this.userInfo.text = `${time}s后重新发送`;
            }

          }, 1000)

          //发起请求
          //加载提示
          this.$toast.loading({
            forbidClick: true,
            duration: 0,
            message: "加载中..."
          });

          this.axios({
            method: 'POST',
            url: '/emailValidCode',
            data: {
              appkey: this.appkey,
              email: this.userInfo.email
            },
            transformRequest: utlis.transformRequest
          }).then(result => {
            this.$toast.clear();
            
            this.$toast(result.data.msg);
          }).catch(err => {
            this.$toast.clear();
            
          })

        }
        
      },

      //下一步
      next() {
        
        //验证验证码
        if (/^[0-9]{6}$/.test(this.userInfo.validCode)) {

           //发起请求
          //加载提示
          this.$toast.loading({
            forbidClick: true,
            duration: 0,
            message: "加载中..."
          });

          this.axios({
            method: 'POST',
            url: '/checkValidCode',
            data: {
              appkey: this.appkey,
              validCode: this.userInfo.validCode
            },
            transformRequest: utlis.transformRequest
          }).then(result => {
            this.$toast.clear();
            // 

            if (result.data.code == 'K001') {

              this.$router.push({name: 'Retrieve'});

            } else {
              this.$toast(result.data.msg);
            }
            
          }).catch(err => {
            this.$toast.clear();
            
          })

          

        } else {
          this.$toast('请输入6位数字验证码');
        }

        
      }
    }
  }
</script>

<style lang="less" scoped>
  .email{
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