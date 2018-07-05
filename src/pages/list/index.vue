<template>
  <div>
    <div class="list_wrap">
      <div class="list" v-for="(item, index) in listData" :key="index">
        <div class="list_l">
          <p class="list_time">{{ currentTime }}</p>
          <p class="list_name">{{ item.city }}</p>
        </div>
        <div class="list_m">
          <img :src="item.dayPictureUrl" alt="">
          <text class="icon_space">~</text> 
          <img :src="item.nightPictureUrl" alt="">
        </div>
        <div class="list_r">
          {{ item[selectTemperature] + '°'  }}
        </div>
      </div>
      <div class="list last_list" style="height:60rpx">
        <p class="list_tooggle">
          <span @click="toggleTemperature('centigrade')" :class="{ 'linght' :  selectTemperature === 'centigrade'}">℃ </span>
          <span> / </span>
          <span @click="toggleTemperature('Fahrenheit')" :class="{ 'linght' :  selectTemperature === 'Fahrenheit'}">℉</span>
        </p>
        <a href="/pages/queryCity/main" class="list_add">
          <img src="../../images/add.png" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import bmap from '@/libs/bmap-wx.js'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
    card
  },
  computed: {
    ...mapState({
      city: state => state.weather.city
    })
  },
  data () {
    return {
      listData: [],
      selectTemperature: 'centigrade',
      currentTime: ''
    }
  },
  methods: {
    toggleTemperature (type) {
      this.selectTemperature = type
      console.log(this.selectTemperature)
    },
    setListData (data) {
      // console.log(data)
      this.listData = []
      data.forEach((item, index, arr) => {
        let data = {}
        data.city = item.currentCity
        data.centigrade = parseInt(item.weather_data[0].date.slice(-4, -2))
        data.dayPictureUrl = item.weather_data[0].dayPictureUrl
        data.nightPictureUrl = item.weather_data[0].nightPictureUrl
        data.Fahrenheit = parseInt(data.centigrade * 1.8 + 32)
        this.listData.push(data)
      })
      // console.log(this.listData)
    },
    getCity (position) {
      return new Promise((resolve, reject) => {
        var BMap = new bmap.BMapWX({
          ak: '9YwccUDP6itfMPMRcH1R88aVRiRapkev'
        })
        BMap.weather({
          location: position,
          fail (error) {
            reject(error)
          },
          success (res) {
            resolve(res.originalData.results[0])
          }
        })
      })
    },
    getAllCity () {
      return new Promise(async (resolve, reject) => {
        let promiseAll = []
        for (let i in this.city) {
          let course = this.getCity(this.city[i])
          promiseAll.push(course)
        }
        let res = await Promise.all(promiseAll)
        resolve(res)
      })
    },
    ...mapMutations({
      'SET_CITY': 'SET_CITY',
      'REMOVE_CITY': 'REMOVE_CITY'
    })
  },
  async onShow () {
    wx.showLoading({
      title: '加载中'
    })
    // console.log(this.city)
    // console.log(this.currentTime)
    // console.log(this.currentTime)
    let res = await this.getAllCity()
    // console.log(res)
    this.setListData(res)
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
.list_r{
  font-size: 28px;
}
.list_m img{
  width: 26px;
  height: 20px;
  border-radius: 5px;
}
.list{
  display: flex;
  height: 80rpx;
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.4);
  justify-content: space-between;
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
