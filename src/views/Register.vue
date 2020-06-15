<template>
  <div class="register">
    <div class="close" @click="close">
      关闭
    </div>
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>
    <van-form @submit="register">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        placeholder="请输入11位手机号"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.nickName"
        name="昵称"
        label="昵称"
        placeholder="昵称1-6位"
        autocomplete="off"
      />
      <van-field
        v-model="userInfo.password"
        name="密码"
        label="密码"
        placeholder="密码6-16位"
        autocomplete="off"
      />
      <div class="btn-box">
        <van-button round block type="info" native-type="submit"
          >新用户注册</van-button
        >
      </div>
    </van-form>
    <div class="tips">
      <div class="tips-left">
        已账号？去 <span class="login" @click="goRegister">登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { valid } from "../utlis/valid";
import { utlis } from "../utlis/utlis";

export default {
  name: "Register",
  computed: {
    userInfo() {
      return this.$store.state.registerModule.userInfo;
    }
  },
  methods: {
    //注册
    register() {
      //
      if (valid.validForm(this.userInfo, this)) {
        //加载提示
        this.$toast.loading({
          //是否禁止点击背景
          frobidClick: true,
          duration: 0,
          //内容
          message: "注册中...."
        });

        this.axios({
          method: "POST",
          url: "/register",
          data: {
            appkey: this.appkey,
            nickName: this.userInfo.nickName,
            phone: this.userInfo.phone,
            password: this.userInfo.password
          },
          //序列化请求参数
          transformRequest: utlis.transformRequest
        })
          .then(result => {
            //关闭加载提示
            this.$toast.clear();
            //如果注册成功
            if (result.data.code == 100) {
              //跳转登录组件
              this.$router.push({ name: "Login" });
            } else {
              this.$toast({
                message: result.data.msg
              });
            }
          })
          .catch(err => {
            //关闭加载提示
            this.$toast.clear();
          });
      }
    },
    goRegister() {
      //跳转页面
      this.$router.push({ name: "Login" });
    },
    close() {
      this.$router.push({ name: "Home" });
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 667px;
  overflow: hidden;
  background: url("../assets//images/loginbg.jpg") no-repeat;
  background-size: 100% 130%;
  .close {
    position: absolute;
    top: 20px;
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
    margin: 30px auto;
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
      color: #22150c;
      font-size: 20px;
    }
  }
  .tips {
    width: 90%;
    margin: -20px auto;
    color: #22150c;
    font-size: 16px;
    .login {
      color: #22150c;
      font-weight: bold;
      font-size: 20px;
    }
    .tips-left {
      width: 40%;
      float: right;
      font-size: 16px;
    }
  }
}
</style>
