<template>
  <div class="my">
    <!-- :style="{backgroundImage: 'url(' + userInfo.userBg + ')'}" -->
    <div class="bg">
      <div class="person">
        <div class="avatar">
          <img class="auto-img" :src="userInfo.userImg" alt="">
        </div>
        <div class="nickname" v-if="isLogin">{{userInfo.nickName}}</div>
        <div class="nickname" v-else @click="goState()">登录</div>
      </div>
      <div class="desc">{{userInfo.desc == '' ? '个性签名' : userInfo.desc}}</div>
    </div>
    <van-cell-group>
      <van-cell v-for="(item, index) in cellData" :key="index" :title="item.title" :icon="item.icon" size="large" @click="goPage(item.name)" is-link />
    </van-cell-group>
  </div>
</template>

<script>

  import {mapState} from 'vuex'

  import {utlis} from '../utlis/utlis'

  export default {
    name: 'My',

    created() {
      this.$store.commit('myModule/changeData', {key: 'userInfo', value: {}});
      this.getUserInfo();
    },

    computed: {
      isLogin() {
        return this.$store.state.isLogin;
      },
      ...mapState('myModule', ['cellData', 'userInfo'])
    },

    methods: {
      goPage(name) {
        if (!this.isLogin) {
          this.$toast('请先登录');
          return;
        }
        this.$router.push({name});
      },

      goState() {
        this.$router.push({name: 'Login'});
      },

      //获取用户信息
      getUserInfo() {
        let tokenString = localStorage.getItem('_t');

        //加载提示
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: "加载中..."
        });

        this.axios({
          method: 'GET',
          url: '/findMy',
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

          this.$store.commit('myModule/changeData', {key: 'userInfo', value: result.data.result[0]});
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //  上传头像
      // upload(file) {
      //   // 

      //   if (!this.isLogin) {
      //     this.$toast('请先登录');
      //     return;
      //   }

      //   //控制上传图片大小不能超过 300KB
      //   let imgSize = 300 * 1024;
      //   if (file.file.size > imgSize) {
      //     this.$toast('上传图片大小不能超过300KB');
      //     return;
      //   }

      //   //将图片上传到服务器

      //   //获取图片类型
      //   let imgType = file.file.type.split('/')[1];
      //   // 

      //   //处理图片的base64
      //   let serverBase64Img = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');
      //   // 

      //   let tokenString = localStorage.getItem('_t');

      //   //加载提示
      //   this.$toast.loading({
      //     forbidClick: true,
      //     duration: 0,
      //     message: "加载中..."
      //   });

      //   this.axios({
      //     method: 'POST',
      //     url: '/updateUserBg',
      //     data: {
      //       appkey: this.appkey,
      //       tokenString,
      //       imgType,
      //       serverBase64Img
      //     },
      //     transformRequest: utlis.transformRequest
      //   }).then(result => {
      //     this.$toast.clear();
          
      //     this.userInfo.userBg = result.data.userBg;
      //   }).catch(err => {
      //    this.$toast.clear();
          
      //   })

      // }
    }
  }
</script>

<style lang="less" scoped>
  .my{
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
  }
    .bg{
      height: 80px;
      background-color: #644f3e;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      padding: 60px 20px;
      position: relative;
    }
    .mybg{
      position: absolute;
    bottom: 20px;
    left: 14px;
    color: white;
    font-size: 12px;
    background-color: #cea68c;
    border-radius: 10px;
    padding: 5px;
    }
    .v-bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      opacity: 0;
    }
    .person{
      display: flex;
    }
    .avatar{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #e8e8e8;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      overflow: hidden;
    }
    .nickname{
      color: #fff;
      font-size: 18px;
      margin-left: 20px;
      line-height: 80px;
    }

    .desc{
      color: #fff;
      font-size: 14px;
      margin-top: 10px;
      margin-left: 100px;
      margin-top: -20px;
    }
  }
</style>