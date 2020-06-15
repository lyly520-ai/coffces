export const mutations = {

  //清空state数据
  emptyData(state) {
    state.orderData = [];
    state.orderDesc = {
      count: 0,
      total: 0
    };
    state.isSelect = false;
    state.list = [];
    state.addressData = {
      //当前地址
      address: '请选择收货地址',
  
      //收货人
      receiver: '',
  
      //手机号
      phone: ''
    };
    state.sids = [];
  },

  changeData(state, data) {
    state[data.key] = data.value;
  }

}