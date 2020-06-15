export const state = {

  //提交订单数据
  orderData: [],

  orderDesc: {
    //总价
    total: 0,

    //商品总数量
    count: 0
  },

  //是否选择地址
  isSelect: false,

  //地址数据
  list: [],

  addressData: {
    //当前地址
    address: '请选择收货地址',

    //收货人
    receiver: '',

    //手机号
    phone: ''
  },
  

  //购物车sid
  sids: []
  
}