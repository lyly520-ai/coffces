import {state} from './state'

import {mutations} from './mutations'

export const addressModule = {
  namespaced: true,
  state,
  mutations
}