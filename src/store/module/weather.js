const state = {
  city: {}
}
const mutations = {
  SET_CITY (state, payload) {
    state.city[payload.name] = payload.position
    wx.setStorageSync('city', state.city)
    // {"杭州市":"120.2985,30.41875","北京市":"116.16985,39.81929"}
  },
  REMOVE_CITY (state, payload) {
    delete state.city[payload.name]
  }
}
export default{
  state,
  mutations
}
