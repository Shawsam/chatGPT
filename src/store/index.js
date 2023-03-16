import Vuex from 'vuex'
import dialog from './modules/dailog'
import user from './modules/user'

export default new Vuex.Store({
  modules: {
    dialog,
    user
  }
})
