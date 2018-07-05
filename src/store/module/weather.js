const state = {
  city: {},
  currentCity: ''
}
const mutations = {
  SET_CITY (state, payload) {
    console.log(payload)
    if (!state.city[payload.name]) {
      state.city[payload.name] = payload.position
      wx.setStorageSync('city', state.city)
    }
  },
  REMOVE_CITY (state, payload) {
    delete state.city[payload.name]
  },
  CHANGE_CURRENT_CITY (state, payload) {
    state.currentCity = payload
    wx.setStorageSync('currentCity', state.currentCity)
  }
}
export default{
  state,
  mutations
}
