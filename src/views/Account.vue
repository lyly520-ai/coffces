<template>
  <div class="account">
    <van-nav-bar title="账号信息" left-arrow :fixed="true" @click-left="back" />
    <van-cell-group>
      <van-cell class="avatar" title="头像" size="large">
        <template #right-icon>
          <div class="person-img">
            <img class="auto-img" :src="userInfo.userImg" alt="" />
            <van-uploader class="v-uploader" :after-read="upload" />
          </div>
        </template>
      </van-cell>
      <van-cell title="用户id" size="large" :value="userInfo.userId" />
      <van-cell title="手机号" size="large" :value="userInfo.phone" />
      <van-cell class="avatar" title="昵称" size="large">
        <template #right-icon>
          <div>
            <van-field
              class="v-field"
              input-align="right"
              v-model="userInfo.nickName"
              @change="
                changeUserInfo('/updateNickName', 'nickName', userInfo.nickName)
              "
            />
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-field
      v-model="userInfo.desc"
      rows="1"
      autosize
      label="个性签名"
      type="textarea"
      placeholder="最多输入30个字符"
      maxlength="30"
      @change="changeUserInfo('/updateDesc', 'desc', userInfo.desc)"
      show-word-limit
    />
  </div>
</template>

<script>
import { utlis } from "../utlis/utlis";

export default {
  name: "Account",

  data() {
    return {
      userInfo: {
        userImg: "",
        phone: "",
        userId: "",
        nickName: "",
        desc: ""
      }
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    back() {
      this.$router.go(-1);
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
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          this.userInfo = result.data.result[0];
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //修改昵称、简介
    changeUserInfo(url, key, value) {
      let tokenString = localStorage.getItem('_t');

      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          tokenString,
          [key]: value
        },
        transformRequest: utlis.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    //上传头像
    upload(file) {
      //控制上传图片大小不能超过 300KB
      let imgSize = 300 * 1024;
      if (file.file.size > imgSize) {
        this.$toast("上传图片大小不能超过300KB");
        return;
      }

      //将图片上传到服务器

      //获取图片类型
      let imgType = file.file.type.split("/")[1];

      //处理图片的base64
      let serverBase64Img = file.content.replace(
        /data:image\/[A-Za-z]+;base64,/,
        ""
      );

      let tokenString = localStorage.getItem('_t');

      //加载提示
      this.$toast.loading({
        forbidClick: true,
        duration: 0,
        message: "加载中..."
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img
        },
        transformRequest: utlis.transformRequest
      })
        .then(result => {
          this.$toast.clear();
          this.userInfo.userImg = result.data.userImg;
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.account {
  padding-top: 46px;
  width: 100%;
  height: 621px;
  background-color: #f2efea;
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

  .avatar {
    line-height: 48px;
    .person-img {
      width: 40px;
      margin-top: 4px;
      position: relative;
    }
    .v-uploader {
      position: absolute;
      width: 40px;
      height: 40px;
      left: 0;
      top: 0;
      overflow: hidden;
      z-index: 2;
      opacity: 0;
    }
  }
  /deep/ .v-field {
    padding: 0;
    line-height: 48px;
  }

  /deep/ .v-textarea {
    padding: 0;
  }

  /deep/ .van-field__control {
    color: #9697a6;
  }
  /deep/ .van-cell--large {
    border-bottom: 1px solid #969799;
  }
  /deep/ .van-cell__title{
      font-size: 18px;
  }
}
</style>
