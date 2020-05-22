import Vuex from 'vuex'

export const state = () => ({
    categories: [],
    errors: [],
    page: 1,
    dialogVisible: false,
})

export const mutations = {
    SET_CATEGORY_DATA(state, payload) {
        state.categories = payload
    },
    SET_ERRORS(state, payload) {
        state.errors = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_DIALOG(state, payload) {
        state.dialogVisible = payload
    }

}

const createStore = () => {
  return new Vuex.Store({
    state: {
      counter: 0,
      dialogVisible: false,
    },
    mutations: {
      increment (state) {
        state.counter++
      },
      dialogVisible(state){
          console.log('index.js.mutations.dialogVisible')
          state.dialogVisible=true;
      }
    },
    getData({ commit, state }, payload) {
        let search = payload ? payload:''
        console.log('index.js.getData');
        return new Promise((resolve, reject) => {
            //this.$axios.get(`/categories?q=${search}&page=${state.page}`).then((response) => {
            //    commit('SET_CATEGORY_DATA', response.data.data)
            //    resolve()
            //})
        })    
    },
    delData({ commit, state }, payload) {
        console.log('index.js.delData');
        return
    },

  })
}

export default createStore
