export const mutations = {

	changeData(state, data) {
		state[data.key] = data.value;
  },

  removeOrderData(state, index) {
    state.orderData.splice(index, 1);
  }

}