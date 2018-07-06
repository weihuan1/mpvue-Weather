<template>
  <div>
    <div class="list_wrap">
      <div class="list" v-for="(item, index) in listData" :key="index" @click.prevent="checkCity(item)">
        <div class="list_l">
          <p class="list_time">{{ currentTime }}</p>
          <p class="list_name">{{ item.city }}</p>
        </div>
        <div class="list_m">
          <img :src="item.dayPictureUrl" alt="">
          <text class="icon_space">{{ item.weatherText }}</text> 
        </div>
        <div class="list_r">
          {{ item[selectTemperature] + '°'  }}
        </div>
        <div class="delete"  v-show="edit && index !== 0" @click.stop="deleteCity(item, index)">
          <img src="../../images/delete.png" alt="">
        </div>
      </div>
      <div class="list last_list" style="height:60rpx">
        <p class="list_tooggle">
          <span @click="toggleTemperature('centigrade')" :class="{ 'linght' :  selectTemperature === 'centigrade'}">℃ </span>
          <span> / </span>
          <span @click="toggleTemperature('Fahrenheit')" :class="{ 'linght' :  selectTemperature === 'Fahrenheit'}">℉</span>
        </p>
        <span class="list_tooggle" style="font-size:16px;" @click="edit = !edit">{{ edit ? '完成' : '编辑' }}</span>
        <a href="/pages/queryCity/main" class="list_add">
          <img src="../../images/add.png" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
// import bmap from '@/libs/bmap-wx.js'
import fetch from '@/utils/fetch'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
    card
  },
  computed: {
    ...mapState({
      city: state => state.weather.city,
      hefeng_key: state => state.hefeng_key,
      currentCity: state => state.weather.currentCity
    })
  },
  data () {
    return {
      listData: [],
      selectTemperature: 'centigrade',
      currentTime: '',
      edit: false
    }
  },
  methods: {
    // 删除城市
    deleteCity (row, index) {
      this.REMOVE_CITY(row.city)
      this.listData.splice(index, 1)
    },
    // 查看城市天气
    checkCity (row) {
      this.CHANGE_CURRENT_CITY(row.city)
      wx.navigateBack()
    },
    toggleTemperature (type) {
      this.selectTemperature = type
    },
    setListData (data) {
      // console.log(data)
      this.listData = []
      data.forEach((item, index, arr) => {
        let respone = item.HeWeather6[0]
        let data = {}
        data.city = respone.basic.location
        data.centigrade = respone.now.tmp
        data.dayPictureUrl = 'https://cdn.heweather.com/cond_icon/' + respone.now.cond_code + '.png'
        data.Fahrenheit = parseInt(data.centigrade * 1.8 + 32)
        // data.weatherText = respone.now.cond_txt + '    ' + respone.now.wind_dir + respone.now.wind_sc + '级'
        data.weatherText = respone.now.cond_txt
        this.listData.push(data)
      })
    },
    // 修改为接入和风天气数据api
    async getCity (position) {
      return new Promise(async (resolve, reject) => {
        let res = await fetch({
          url: 'https://free-api.heweather.com/s6/weather/now',
          params: {
            location: position,
            key: this.hefeng_key
          }
        })
        if (res.HeWeather6[0].basic) {
          resolve(res)
        } else {
          reject(res.HeWeather6[0].status)
        }
      })
    },
    getAllCity () {
      let promiseAll = []
      for (let i in this.city) {
        let course = this.getCity(i)
        promiseAll.push(course)
      }
      return Promise.all(promiseAll)
    },
    ...mapMutations({
      'SET_CITY': 'SET_CITY',
      'REMOVE_CITY': 'REMOVE_CITY',
      'CHANGE_CURRENT_CITY': 'CHANGE_CURRENT_CITY'
    })
  },
  async onShow () {
    this.edit = false
    wx.showLoading({
      title: '加载中'
    })
    this.getAllCity().then(respone => {
      this.setListData(respone)
    }).catch(error => {
      wx.showModal({
        title: '提示',
        content: error
      })
    })
    wx.hideLoading()
  },
  async created () {
    const time = new Date()
    let minutes = parseInt(time.getMinutes()) >= 10 ? time.getMinutes() : '0' + time.getMinutes()
    let timeInterval = parseInt(time.getHours()) >= 12 ? '下午' : '上午'
    this.currentTime = timeInterval + time.getHours() + ':' + minutes
  }
}
</script>

<style>
page{
  background-image: url(http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg);
  color: #fff;
}
.list_name{
  font-size: 22px;
}
.delete{
  margin-left: 20rpx;
  position: relative;
}
.delete::after{
  position: absolute;
  content: '';
  display: inline-block;
  left: -25rpx;
  top: -30rpx;
  right: -25rpx;
  bottom: -30rpx;
}
.delete img{
  width: 40rpx;
  height: 40rpx;
}
.list_l{
  width: 260rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list_r{
  font-size: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list_m {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
}
.list_m img{
  width: 26px;
  height: 26px;
}
.list{
  display: flex;
  height: 80rpx;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.4);
  /* justify-content: space-between; */
  align-items: center;
  position: relative;
}
.list::after{
  position: absolute;
  content:'';
  display: inline-block;
  left: 0;
  right: 0;
  height: 2rpx;
  bottom: 0;
  background: #fff;
  transform: scaleY(0.6)
}
.last_list{
  background-color: transparent;
}
.last_list::after{
  display: none;
}
.icon_space{
  font-size: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  margin: 0 6px;
}
.list_tooggle{
   flex: 1;
}
.list_tooggle span{
  font-size: 16px;
  color: #d1d1d1
}
.linght{
  color: #fff !important;
}
.list_add img{
  width: 24px;
  height: 24px;
}
</style>
