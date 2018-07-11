<template>
  <div class="container">
    <swiper 
      class="swiper_wrap"
      :style="{ 'height' : swiperHeight}" 
      :indicator-dots="true"
      :current="currentSwiper"
      @change="changeCurrent"
      :indicator-active-color="'#ffffff'">
        <swiper-item v-for="(item, index) in weatherData" class="swiper_item" :key="index" >
          <scroll-view scroll-y  style="height: 100%;">
            <div class="weather_wrap">
              <p><span class="city_name">{{ item.basic.location }}</span></p>
              <p class="weather_title">{{ item.now.cond_txt }}</p>
              <span class="weather_data">{{ item.currentTime }} </span>
              <p class="weather_temperature">{{ item.now.tmp + '°' }}</p>
            </div>
            <div class="weather_now">
              <p class="now_header">
                <span class="now_h2">{{ item.daily_forecast[0].nowWeek }}</span>
                <span class=" today">今天</span>
                <span>{{ item.daily_forecast[0].tmp_min + '~' + item.daily_forecast[0].tmp_max + '℃'}}</span>
              </p>
               <scroll-view scroll-x class="hourly_scroll">
                  <div class="hourly_wrap">
                    <div class="hourly_item" v-for="(list, ind) in item.hourly" :key="ind">
                      <span class="hourly_time">{{ list.times }}</span>
                      <span class="hourly_icon"><img :src="list.hoerlyPictureUrl" alt=""></span>
                      <span class="hourly_expone">{{ list.tmp + '°' }}</span>
                    </div>
                  </div>
                </scroll-view>
            </div>
            <div class="weather_other">
              <div class="other_item" v-for="(list, ind) in item.daily_forecast" :key="ind" v-if="ind > 0">
                <span class="other_name">{{ list.nowWeek }}</span>
                <div class="other_icon">
                  <img :src="list.pictureUrl_d" alt="">
                  <text class="icon_space"> ~ </text>  
                  <img :src="list.pictureUrl_n" alt=""/>
                </div>
                <span>{{ list.tmp_min + '~' + list.tmp_max + '℃'}}</span>
              </div>
            </div>
            <div class="exponential_wrap" style="margin-bottom: 0">
              <div class="exponential_item" v-for="(list, ind) in item.lifestyle" :key="ind">
                <div class="expon_img">
                  <img :src="list.liftPictureUrl" alt=""/>
                </div>
                <div class="expon_banner">
                  <p class="expon_title">{{ lifeType[list.type] + '  ' + list.brf }}</p>
                  <p class="expon_des"> {{ list.txt }}</p>
                </div>
              </div>
            </div>
            <span class="tips" >数据来源 和风天气</span>  
          </scroll-view>
        </swiper-item>
    </swiper>
    <a href="/pages/list/main" class="list" ><img src="../../images/list.png" alt=""></a>
  </div>
</template>

<script>
import fetch from '@/utils/fetch.js'
import {getWeek} from '@/utils/index'
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      motto: 'My weather forecast',
      userInfo: {},
      weatherData: [],
      lifeType: {comf: '舒适度指数', cw: '洗车指数', drsg: '穿衣指数', flu: '感冒指数', sport: '运动指数', trav: '旅游指数', uv: '紫外线指数', air: '空气污染扩散条件指数', ac: '空调开启指数', ag: '过敏指数', gl: '太阳镜指数', mu: '化妆指数', airc: '晾晒指数', ptfc: '交通指数', fsh: '钓鱼指数', spi: '防晒指数'},
      swiperHeight: '150px',
      currentSwiper: 0
    }
  },
  components: {},
  computed: {
    ...mapState({
      city: state => state.weather.city,
      hefeng_key: state => state.hefeng_key,
      currentCity: state => state.weather.currentCity
    })
  },
  methods: {
    //  切换swiper
    changeCurrent (event) {
      this.currentSwiper = event.target.current
    },
    async getCity (position) {
      // 同步获取实时数据 未来3天数据 逐小时预报数据
      return new Promise(async (resolve, reject) => {
        let res = await fetch({
          url: 'https://free-api.heweather.com/s6/weather/',
          params: {
            location: position,
            key: this.hefeng_key
          }
        })
        if (res.HeWeather6[0].basic) {
          resolve(res.HeWeather6[0])
        } else {
          reject(res.HeWeather6[0].status)
        }
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
      let time = new Date()
      res.forEach((item, index, arr) => {
        let minuties = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()
        item.currentTime = item.update.loc.slice(5, 11) + time.getHours() + ':' + minuties + ' 更新'
        item.cond_pictureUrl = 'https://cdn.heweather.com/cond_icon/' + item.now.cond_code + '.png'
        item.daily_forecast.forEach((list, ind, arr1) => {
          list.nowWeek = getWeek(ind)
          list.pictureUrl_d = 'https://cdn.heweather.com/cond_icon/' + list.cond_code_d + '.png'
          list.pictureUrl_n = 'https://cdn.heweather.com/cond_icon/' + list.cond_code_n + '.png'
        })
        item.lifestyle.forEach((list, ind, arr1) => {
          list.liftPictureUrl = 'http://p949rmsaf.bkt.clouddn.com/' + list.type + '.png'
        })
        item.hourly.unshift(Object.assign({}, item.hourly[0]))
        item.hourly.forEach((list, ind, arr1) => {
          if (ind === 0) {
            list.times = '现在'
            list.hoerlyPictureUrl = 'https://cdn.heweather.com/cond_icon/' + item.now.cond_code + '.png'
            list.tmp = item.now.tmp
          } else {
            let time = parseInt(list.time.slice(-6, -3))
            list.times = time >= 12 ? '下午' + (time - 12) + '时' : '上午' + time + '时'
            list.hoerlyPictureUrl = 'https://cdn.heweather.com/cond_icon/' + list.cond_code + '.png'
          }
        })
        // 定位到当前swiper
        if (item.basic.location === this.currentCity) {
          this.currentSwiper = index
        }
      })
      this.weatherData = res
    },
    getAllCity () {
      let promiseAll = []
      for (let i in this.city) {
        let course = this.getCity(i)
        promiseAll.push(course)
      }
      return Promise.all(promiseAll)
    },
    isEmptyObject (obj) {
      for (var key in obj) {
        return false
      }
      return true
    },
    async getCurrentCity (str) {
      let res = await fetch({
        url: 'https://free-api.heweather.com/s6/weather',
        params: {
          location: str,
          key: this.hefeng_key
        }
      })
      if (res.HeWeather6[0].basic) {
        this.SET_CITY({name: res.HeWeather6[0].basic.parent_city, position: str})
        this.CHANGE_CURRENT_CITY(res.HeWeather6[0].basic.parent_city)
        this.getAllCity().then(respone => {
          this.setWeatherData(respone)
        }).catch(error => {
          wx.showModal({
            title: '提示',
            content: error
          })
        })
        wx.hideLoading()
      } else {
        wx.showModal({
          title: '提示',
          content: res.HeWeather6[0].status
        })
      }
    },
    ...mapMutations([
      'SET_CITY',
      'CHANGE_CURRENT_CITY'
    ])
  },
  async created () {
    // 获取手机可用像素高度
    wx.getSystemInfo({
      success: (res) => {
        this.swiperHeight = res.windowHeight + 'px'
      }
    })
  },
  async onShow () {
    //  全部异步获取缓存地区的所有天气
    wx.showLoading({
      title: '加载中'
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
      this.getAllCity().then(respone => {
        this.setWeatherData(respone)
      }).catch(error => {
        wx.showModal({
          title: '提示',
          content: error
        })
      })
      wx.hideLoading()
    }
  },
  onHide () {
    // 离开页面保存当前选中城市
    let currentCity = this.weatherData[this.currentSwiper].basic.location
    this.CHANGE_CURRENT_CITY(currentCity)
  }
}
</script>

<style >
page{
  background: #70b0ea;
}
.now_header{
  display: flex;
  padding: 0 30rpx;
  align-items: center;
  margin-bottom: 2px;
}
.hourly_scroll{
  height: 90px;
  border-top: 1rpx solid #fff;
  border-bottom: 1rpx solid #fff;
  background-color: rgba(255, 255, 255, 0.12);
}
.hourly_expone{
  font-size: 20px;
}
.hourly_wrap{
  display: flex;
  width: 660px;
  margin-top: 5px;
}
.hourly_item{
  display: flex;
  flex-direction: column;
  width: 70px;
  margin-left: 5px;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}
.hourly_wrap .hourly_item:first-child{
  width: 50px !important;
}
.now_h2{
  font-size: 17px;
}
.today{
  margin-left: 20rpx;
  flex: 1;
}
.tips{
  display: block;
  width: 750rpx;
  height: 50px;
  text-align: center;
  margin-top: 10px;
}
.swiper_wrap{
  color:#fff;
  width: 750rpx;
  height: 600rpx;
}
.weather_wrap{
  position: relative;
  width: 750rpx;
  padding-top: 20px;
  text-align: center;
  top:0;
  z-index: 66;
  background-color: #70b0ea;
}
.weather_now{
  /* margin-top: 150px */
}
.list{
  position: fixed;
  bottom: 10px;
  right: 20px;
  z-index: 66;
  display: flex;
  width: 40px;
  height: 40px;
  background-color: red;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7)
}
.list img{
  height: 20px;
  width: 20px;
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
}
.weather_data{
  position: absolute;
  right: 15px;
  top: 36px;
}
.city_name{
  font-size: 30px;
}
.weather_other{
  background-color: rgba(255, 255, 255, 0.12);
  margin: 20rpx 0;
  padding: 0 30rpx 40rpx;
}
.exponential_wrap{
  flex-direction: column;
  display: flex;
  background-color: rgba(255, 255, 255, 0.12);
  padding-bottom: 40rpx;
  margin: 20rpx 0;
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

.other_item{
  display: flex;
  flex:1;
  text-align: center;
  flex-direction: row;
  justify-content: space-between;
}
.other_item span{
  margin-top: 20rpx;
}
.other_name{
  font-size: 17px;
  width: 110rpx;
  text-align: left;
  white-space: nowrap;
}
.other_icon{
  margin-top: 10rpx;
}
.other_icon img, .hourly_icon img{
  width: 26px;
  height: 26px;
  vertical-align: middle;
}
.weather_title img{
  width: 26px;
  height: 26px;
  vertical-align: middle;
  margin-right: 4rpx;
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
