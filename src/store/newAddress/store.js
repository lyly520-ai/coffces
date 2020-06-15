import {state} from './state'

import {mutations} from './mutations'

export const newAddressModule = {
  namespaced: true,
  state,
  mutations
}