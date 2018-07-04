const state = {
  city: {}
}
const mutations = {
  SET_CITY (state, payload) {
    state.city[payload.name] = payload.position
    wx.setStorageSync('city', state.city)
  },
  REMOVE_CITY (state, payload) {
    delete state.city[payload.name]
  }
}
export default{
  state,
  mutations
}
