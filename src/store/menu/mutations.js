export const mutations = {

    //修改数据
    changeData(state,data){
        state[data.key] = data.value;
    },
}