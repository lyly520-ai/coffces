export const mutations = {

  //修改数据
  changeData(state, data) {
    state[data.key] = data.value;
  },

  //置空
  emptyData(state) {
    state.productDetailData = {};
    state.rules = [];
    state.count = 1;
    state.desc = [];
    state.isLike = false;
    state.shopcartTotal = 0;
  },

  changeProductDetailData(state, data) {
    // 

    //商品规格整理
    let titles = {
      tem: data.tem_desc,
      milk: data.milk_desc,
      sugar: data.sugar_desc,
      cream: data.cream_desc
    };

    for (let key in titles) {
      
      //如果当前商品的规格不存在，则直接跳过本轮循环
      if (data[key] == '') {
        continue;
      }

      let o = {
        title: titles[key],
        rule: []
      };

      let ruleData = data[key].split('/');
      // 

      for (let i = 0; i < ruleData.length; i++) {
        let o1 = {
          text: ruleData[i],
          isActive: i == 0
        };

        o.rule.push(o1);

      }

      state.rules.push(o);
    }


    //商品描述
    state.desc = data.desc.split(/\n/);
    // 

    state.productDetailData = data;

  }

}