<template>
  <div class="container">

    <!-- <open-data type="userAvatarUrl"></open-data>
    <open-data type="userNickName" lang="zh_CN"></open-data>
    <button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"> </button>
    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div> -->
    <!-- <a href="/pages/logs/main" class="counter">去往Vuex示页面</a> -->
    <swiper 
      class="swiper_wrap"
      :style="{ 'height' : swiperHeight}" 
      :indicator-dots="true"
      :indicator-active-color="'#ffffff'">
        <swiper-item v-for="(item, index) in weatherData" class="swiper_item" :key="index">
          <div class="weather_wrap">
            <p><span class="city_name">{{ item.currentCity }}</span></p>
            <p class="weather_title">{{ item.weather_data[0].weather }}</p>
            <span class="weather_data">{{ item.currentTime }} </span>
            <p class="weather_temperature">{{ item.currentTemperature }}</p>
            <span class="weather_pm">{{ item.pmGrade }}</span>
          </div>
          <div class="weather_other">
            <div class="other_item" v-for="(list, ind) in item.weather_data" :key="ind">
              <span class="other_name">{{ list.time }}</span>
              <div class="other_icon">
                <img :src="list.dayPictureUrl" alt="">
                <text class="icon_space">~</text>  
                <img :src="list.nightPictureUrl" alt="">
              </div>
              <span>{{ list.temperature }}</span>
              <span>{{ list.weather }}</span>
              <span>{{ list.wind }}</span>
            </div>
          </div>
          <div class="exponential_wrap">
            <div class="exponential_item" v-for="(list, ind) in item.index" :key="ind">
              <div class="expon_img">
                <img :src="imagesArr[ind]" alt="">
              </div>
              <div class="expon_banner">
                <p class="expon_title">{{ list.tipt + '  ' + list.title }}</p>
                <p class="expon_des"> {{ list.des }}</p>
              </div>
            </div>
          </div>
        </swiper-item>
    </swiper>
  </div>
</template>

<script>
import card from '@/components/card'
import bmap from '@/libs/bmap-wx.js'
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      motto: 'My weather forecast',
      userInfo: {},
      weatherData: [],
      swiperHeight: '150px',
      imagesArr: ['../../../static/images/clothes.png', '../../../static/images/car.png', '../../../static/images/influenza.png', '../../../static/images/sports.png', '../../../static/images/sunshine.png']
    }
  },

  components: {
    card
  },
  computed: {
    ...mapState({
      city: state => state.weather.city
    })
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
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
    // 获取PM2.5划分值
    getPmGrade (num) {
      num = parseInt(num)
      if (num <= 35) {
        return '优  ' + num
      } else if (num > 35 && num <= 75) {
        return '良  ' + num
      } else if (num > 75 && num <= 115) {
        return '轻度污染  ' + num
      } else if (num > 115 && num <= 150) {
        return '中度污染  ' + num
      } else if (num > 150 && num <= 250) {
        return '重度污染  ' + num
      } else if (num > 250) {
        return '严重污染  ' + num
      }
    },
    // 设置原数据
    setWeatherData (res) {
      const time = new Date()
      res.forEach((item, index, arr) => {
        let timeStr = time.getHours() + ':' + time.getMinutes()
        let date1 = item.weather_data[0].date
        item.currentTime = date1.slice(3, 5) + '-' + date1.slice(6, 8) + '  ' + timeStr + '  更新'
        item.currentTemperature = date1.slice(14, -2) + '°'
        item.pmGrade = this.getPmGrade(item.pm25)
        item.weather_data.forEach((list, ind, arr1) => {
          if (ind === 0) {
            list.time = '今天'
          } else {
            list.time = list.date.slice(0, 3)
          }
        })
      })
      // res.weather_data.forEach((item, index, arr) => {
      //   item.time = item.date.slice(0, 3)
      // })
      console.log(res)
      this.weatherData = res
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
    isEmptyObject (obj) {
      for (var key in obj) {
        return false
      }
      return true
    },
    getCurrentCity (str) {
      var BMap = new bmap.BMapWX({
        ak: '9YwccUDP6itfMPMRcH1R88aVRiRapkev'
      })
      // 发起weather请求
      BMap.weather({
        location: str,
        fail (error) {
          console.log(error)
        },
        success: async (res) => {
          this.SET_CITY({name: res.currentWeather[0].currentCity, position: str})
          let respone = await this.getAllCity()
          this.setWeatherData(respone)
          wx.hideLoading()
        }
      })
    },
    ...mapMutations([
      'SET_CITY'
    ])
  },
  async created () {
    //  全部异步获取缓存地区的所有天气
    wx.showLoading({
      title: '加载中'
    })
    // 获取手机可用像素高度
    wx.getSystemInfo({
      success: (res) => {
        this.swiperHeight = res.windowHeight + 'px'
      }
    })
    if (this.isEmptyObject(this.city)) {
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          let str = res.longitude + ',' + res.latitude
          this.getCurrentCity(str)
        },
        fail: error => {
          console.log(error)
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '位置服务已被拒绝，请在后台开启后使用'
          })
        }
      })
    } else {
      let res = await this.getAllCity()
      this.setWeatherData(res)
      wx.hideLoading()
    }
  }
}
</script>

<style scoped>
.swiper_wrap{
  width: 750rpx;
  height: 600rpx;
  background-image: url(http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg);
}
.weather_wrap{
  position: relative;
  padding-top: 20px;
  text-align: center
}
.weather_pm{
  display: inline-block;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
}
.weather_temperature{
  font-size: 60px;
  margin-left: 20px;
  margin-top: 10px;
}
.weather_data{
  position: absolute;
  right: 15px;
  top: 36px;
}
.city_name{
  font-size: 30px;
}
.weather_other ,.exponential_wrap{
  display: flex;
  background-color: rgba(255, 255, 255, 0.12);
  padding-bottom: 40rpx;
  margin: 20rpx 0;
}
.exponential_wrap{
  flex-direction: column;
}
.exponential_item{
  position: relative;
  display: flex;
  padding: 15rpx 20rpx;
  align-items: center;
}
.expon_des{
  font-size: 12px;
}
.swiper_item{
  overflow-y: scroll;
}
/* .swiper_item::-webkit-scrollbar {display:none} */
.expon_title{
  font-size: 14px;
  margin-bottom: 6px;
}
.exponential_item::after{
  content: "";
  position: absolute;
  display: inline-block;
  bottom: 0;
  left: 15px;
  right: 15px;
  height: 2rpx;
  background-color: #fff;
  transform: scaleY(0.6)
}
/* .expon_banner{
  display: flex;
} */
.other_item{
  display: flex;
  flex:1;
  text-align: center;
  flex-direction: column;
  justify-content: space-around;
}
.other_item span{
  margin-top: 20rpx;
}
.other_name{
  margin-bottom: 20rpx;
  font-size: 16px;
}
.icon_space{
  font-size: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  margin: 0 6px;
}
.other_icon img {
  width: 40rpx;
  height: 40rpx;
}
.exponential_item img{
  margin: 0 20px;
  width: 60px;
  height: 60px;
  float: left;
  vertical-align: middle
}
.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
