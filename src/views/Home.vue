<template>
  <div class="home">
    <van-swipe :autoplay="5000" indicator-color="white">
      <van-swipe-item >
        <img class="auto-img" src="../assets/images/home1.jpg" alt />
      </van-swipe-item>
      <van-swipe-item>
        <img class="auto-img" src="../assets/images/home2.jpg" alt />
      </van-swipe-item>
    </van-swipe>
    <div class="discount">
      <div class="title"><span></span>精选咖啡<span></span></div>
      <div class="product">
        <div class="product-left clearfix">
          <div class="left-content">
            <van-image
              round
              width="80px"
              height="80px"
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586894838167&di=189e7f2a0d57dc4797ebbae2fd2c70df&imgtype=0&src=http%3A%2F%2Fimage.f600.cn%2FJMSpider%2F71946e0b9f7146e18d1880f3a9f59c10%2F1523A0E1FD7.jpg"
            />
            <div class="title-left">
              <div class="left-one">午后咖啡精选</div>
              <div class="left-two">为你的生活补充能量</div>
              <div class="left-one">￥25起</div>
            </div>
          </div>
          <div class="left-content">
            <van-image
              round
              width="80px"
              height="80px"
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586894838169&di=21dabcfe2db954f054575d2f05818ee9&imgtype=0&src=http%3A%2F%2Fimg3.duitang.com%2Fuploads%2Fitem%2F201412%2F28%2F20141228092141_4Zrx5.jpeg"
            />
            <div class="title-left">
              <div class="left-one">咖啡类型齐全</div>
              <div class="left-two">总有一款适合你</div>
              <div class="left-one">￥25起</div>
            </div>
          </div>
        </div>
        <div class="product-right">
          <van-image
            round
            width="100px"
            height="100px"
            src="http://www.kangliuyong.com:10002/images/product_small/IMG_0381_02p.jpg"
          />
          <div class="title-right">
            <div class="right-one">焦糖玛奇朵</div>
            <div class="right-two">一种不一样的口味</div>
            <div class="right-one">￥28</div>
          </div>
        </div>
      </div>
      <div class="title"><span></span>店长推荐<span></span></div>
      <div class="recommend">
        <van-grid :border="false" :column-num="2" :gutter="10">
          <van-grid-item to="menu">
            <van-image src="http://www.kangliuyong.com:10002/images/product_small/IMG_0388_02p.jpg" />
            <div class="van-text">抹茶瑞纳冰</div>
          </van-grid-item>
          <van-grid-item to="menu">
            <van-image src="http://www.kangliuyong.com:10002/images/product_small/IMG_0392_02p.jpg" />
            <div class="van-text">黑糖啵啵拿铁</div>
          </van-grid-item>
        </van-grid>
        <van-grid :border="false" :column-num="2" :gutter="10">
          <van-grid-item to="menu">
            <van-image src="http://www.kangliuyong.com:10002/images/product_small/IMG_0390_02p.jpg" />
            <div class="van-text">奥瑞白</div>
          </van-grid-item>
          <van-grid-item to="menu">
            <van-image src="http://www.kangliuyong.com:10002/images/product_small/IMG_0385_02p.jpg" />
            <div class="van-text">榛果拿铁</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'Home',
  
};
</script>

<style lang="less" scoped>
.home {
  .fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix{
  content: '';
  display: block;
  clear: both;
}
  .van-swipe-item {
    color: #fff;
    font-size: 20px;
    text-align: center;
    > img {
      width: 100%;
      height: 180px;
    }
  }
  .discount {
    .title {
      width: 96%;
      margin: 0px auto;
      font-size: 18px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #151515;
      text-align: center;
      color: #353535;
      > span {
        display: inline-block;
        width: 12px;
        height: 1px;
        background-color: #d9d9d9;
        vertical-align: middle;
        position: relative;
        top: 1px;
        margin: 0 10px;
      }
    }
    .product {
      width: 96%;
      height: 230px;
      margin-top: 10px;
      margin: 0px auto;
      .product-content {
        width: 48%;
        height: 100px;
        background-color: #8b7e75;
        position: relative;
        .van-image {
          margin-top: 20px;
          margin-left: 5px;
        }
        .title-box {
          position: absolute;
          top: 10px;
          right: 8px;
          > div {
            color: #fafafc;
          }
          .text-one {
            font-size: 14px;
            margin-top: 10px;
          }
          .text-two {
            font-size: 12px;
          }
        }
      }
      .product-left {
        width: 60%;
        height: 220px;
        float: left;
        margin-top: 10px;
        .left-content {
          width: 100%;
          height: 105px;
          margin-bottom: 10px;
          background-color: #8b7e75;
          position: relative;
          .van-image {
            margin-top: 10px;
            margin-left: 8px;
          }
          .title-left {
            position: absolute;
            top: 3px;
            right: 6px;
            > div {
              margin: 5px 0;
              color: #fafafc;
            }
            .left-one {
              font-size: 18px;
              margin-top: 10px;
            }
            .left-two {
              font-size: 14px;
            }
          }
        }
      }
      .product-right {
        width: 36%;
        height: 220px;
        margin-left: 2%;
        margin-top: 10px;
        background-color: #8b7e75;
        float: right;
        .van-image {
          margin-top: 10px;
          margin-left: 16px;
        }
        .title-right {
          height: 110px;
          margin: 0 8px;
          > div {
            margin: 5px 0;
            color: #fafafc;
          }
          .right-one {
            font-size: 18px;
            margin-top: 10px;
          }
          .right-two {
            font-size: 14px;
          }
        }
      }
    }
    .recommend {
      padding-bottom: 50px;
      margin-top: 10px;
      width: 100%;
      .van-grid-item{
        margin-bottom: 10px;
        .van-text{
        font-size: 18px;
        color: white;
        margin-top: 8px;
        }  
        /deep/ .van-grid-item__content{
          background-color: #8b7e75;
        }
      }
    }
  }
}
</style>
