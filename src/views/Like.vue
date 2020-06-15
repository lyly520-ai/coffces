<template>
  <div class="like">
    <van-nav-bar title="我的收藏" left-arrow :fixed="true" @click-left="back" />
    <template v-if="likeData.length > 0">
      <div class="like-box">
        <van-card
          :title="item.name"
          :desc="item.desc"
          :price="item.price"
          :thumb="item.smallImg"
          v-for="(item, index) in likeData"
          :key="index"
          @click="goPage(item.pid)"
        >
          <template #footer>
            <van-button size="mini" @click.stop="removeLike(item.pid, index)"
              >删除</van-button
            >
          </template>
        </van-card>
      </div>
    </template>
    <template v-else>
      <div>
        <div class="not-like">
          <div class="not-like-icon">
            <van-icon name="like" />
          </div>
          <div v-if="isLogin">没有收藏商品，赶紧去逛一逛！</div>
          <div v-else>
            <span class="login-text" @click="goState">登录，查看收藏数据</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { utlis } from "../utlis/utlis.js";
export default {
  name: "Like",

  created() {
    this.getLikeData();
  },

  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    },
    ...mapState("likeModule", ["likeData"])
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    goState() {
      this.$router.push({ name: "Login" });
    },

    //获取我的收藏商品数据
    getLikeData() {
      let tokenString = localStorage.getItem("_t");
      //初始化数据
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$store.commit("changeData", {
            key: "isLogin",
            value: result.data.code != 700
          });

          if (result.data.code == 700) {
            return;
          }

          if (result.data.code == 2000) {
            this.$store.commit("likeModule/changeData", {
              key: "likeData",
              value: result.data.result
            });
          }
        })
        .catch(err => {});
    },

    //查看商品详情
    goPage(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },

    //删除我的收藏商品
    removeLike(pid, index) {
      let tokenString = localStorage.getItem("_t");

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        },
        transformRequest:  utlis.transformRequest
      })
        .then(result => {
          this.$store.commit("likeModule/changeLikeData", index);
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less" scoped>
.like {
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
  .van-card {
    margin-bottom: 10px;
    .van-card__title {
      line-height: 32px;
      font-size: 20px;
    }
    .van-card__price {
      color: red;
      font-size: 20px;
    }
    .van-card__price-integer {
      font-size: 22px;
      color: red;
    }
  }
  .not-like {
    font-size: 18px;
    margin-top: 50px;
    color: #e0e0e0;
    text-align: center;
  }
  .not-like-icon {
    font-size: 64px;
  }
  .login-text {
    color: #444;
  }
}
</style>
