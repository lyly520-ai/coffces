<template>
  <div class="login">
    <div class="close" @click="close">
     关闭
    </div>
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>
    <van-form @submit="login">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="请输入11位手机号"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码6-16位"
        autocomplete="off"
      />
      <div class="btn-box">
        <van-button round block type="info" native-type="submit"
          >登  录</van-button
        >
      </div>
      <div class="tips">
        <div class="tips-left">没有账号？去 <span class="register" @click="goRegister">注册</span></div>
        <div class="tips-right"><span class="register" @click="goEmail">忘记密码</span></div>
      </div>
    </van-form>
  </div>
</template>

<script>
import {valid} from '../utlis/valid'
import {utlis} from '../utlis/utlis'

export default {
  name: "Login",
  computed: {
    userInfo() {
      return this.$store.state.loginModule.userInfo;
    }
  },
  methods: {
    //登录
    login() {
      

      if (valid.validForm(this.userInfo, this)) {

        //发起ajax请求
        

        //加载提示
        this.$toast.loading({
          
          //是否禁止背景点击
          forbidClick: true,

          //禁止自动关闭
          duration: 0,

          message: '登录中...'

        })

        this.axios({
          method: 'POST',
          url: '/login',
          data: {
            appkey: this.appkey,
            phone: this.userInfo.phone,
            password: this.userInfo.password
          },
          transformRequest: utlis.transformRequest
        }).then(result => {
          

          //关闭加载提示
          this.$toast.clear();

          //如果登录成功后, 将token保存在cookie中
          if (result.data.code == 200) {
            
            //存储token字符串
            localStorage.setItem('_t', result.data.token);

            //跳转页面
            this.$router.push({name: 'Home'});

          } else {
            this.$toast(result.data.msg);
          }

        }).catch(err => {
          
          this.$toast.clear();
        })

      }

      
    },
    goRegister(){
      //跳转页面
      this.$router.push({name: 'Register'});
    },
    close(){
      this.$router.push({name: 'Home'});
    },
    goEmail(){
      this.$router.push({name:'Email'});
    }
    
  }
};
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 637px;
  overflow: hidden;
  background: url("../assets//images/loginbg.jpg") no-repeat;
  background-size: 100% 130%;
  position: relative;
  padding-top:30px;
  .close{
    position: absolute;
    top:20px;
    right: 20px;
    width: 54px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    font-size: 20px;
    color: #22150c;
    font-weight: bold;
  }
  .logo {
    margin: 0px auto 30px;
    width: 150px;
    height: 150px;
  }
  .van-cell {
    background-color: rgba(206, 199, 199, 0.8);
    width: 90%;
    border-radius: 20px;
    margin: 10px auto;
    color: #22150c;
    font-size: 16px;
  }
  .btn-box {
    margin-top: 16px;
    .van-button {
      background-color: #635a55;
      width: 90%;
      border: none;
      margin: 40px auto;
      color:#22150c;
      font-size: 20px;
    }
  }
  .tips{
    width: 90%;
    margin: -16px auto;
    color: #22150c;
    font-size: 16px;
    .tips-left{
      width: 70%;
      float: left;
    }
    .register{
        color:#22150c;
        font-weight: bold;
        font-size: 20px;
      }
    .tips-right{
      width: 30%;
      float: right;
      font-size: 16px;
    }
  }
}
</style>
