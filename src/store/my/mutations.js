export const mutations = {

  changeData(state, data) {
    state[data.key] = data.value;
  }

}