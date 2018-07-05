<template>
  <div class="query_city">
    <div class="query_header">
      <div class="search_wrap">
        <span class="search_icon"><img src="../../images/search.png" alt=""></span>    
        <input type="text" confirm-type="search" v-model.trim="queryCity" @bindconfirm="submit" class="search_input" placeholder="请输入城市名称，拼音或英文">
      </div>
      <div class="search_text" @click="submit">搜索</div>
    </div>
    <div class="city_list" v-show="queryCityData.length === 0 && !queryTips">
      <p class="query_title">当前城市</p>
      <div class="city_item current_city">{{ currentCity }}</div>
        <p class="query_title">热门城市</p>
        <div class="city_wrap">
        <div class="city_item" v-for="(item, index) in cityData" :key="index" @click="selectCity(item)">{{ item.location }}</div>
      </div>
    </div>
    <div class="query_main" v-show="queryCityData.length > 0 || queryTips">
      <span v-if="queryTips" class="query_tips">查找失败，试试换个输入！</span>
      <div class="query_list" v-for="(item, index) in queryCityData" :key="index" @click="selectCity(item)"> {{ item.location }} </div>
    </div>
  </div>
</template>

<script>
// Use Vuex
import fetch from '@/utils/fetch'
import {mapState, mapMutations} from 'vuex'
export default {
  computed: {
    count () {

    },
    ...mapState({
      'currentCity': state => state.weather.currentCity
    })
  },
  data () {
    return {
      cityData: [],
      queryCityData: [],
      queryTips: false,
      queryCity: ''
    }
  },
  async onShow () {
    console.log(this.$store)
    this.getCityData()
  },
  created () {
  },
  methods: {
    // 选择城市
    selectCity (row) {
      console.log(row)
      let json = {
        name: row.location,
        position: row.lon + ',' + row.lat
      }
      this.SET_CITY(json)
      // console.log(wx)
      this.queryCity = ''
      this.queryCityData = []
      this.queryTips = false
      wx.navigateBack()
    },
    // 确定提交
    async submit () {
      console.log(this.queryCity)
      if (this.queryCity.length === 0) {
        this.queryCityData = []
        return false
      }
      wx.showLoading({
        title: '加载中'
      })
      let res = await fetch({
        type: 'GET',
        url: 'https://search.heweather.com/find',
        params: {
          key: 'eeee8bfe147b4fb994647eb384daecf1',
          location: this.queryCity,
          group: 'cn'
        }
      })
      if (res.HeWeather6[0].basic) {
        this.queryCityData = res.HeWeather6[0].basic
        this.queryTips = false
      } else {
        this.queryCityData = []
        this.queryTips = true
      }
      console.log(this.queryCityData)
      wx.hideLoading()
    },
    // 获取城市列表
    async getCityData () {
      wx.showLoading({
        title: '加载中'
      })
      let res = await fetch({
        type: 'GET',
        url: 'https://search.heweather.com/top',
        params: {
          key: 'eeee8bfe147b4fb994647eb384daecf1',
          group: 'cn',
          number: 24
        }
      })
      // console.log(res)
      if (res.HeWeather6[0].basic) {
        this.cityData = res.HeWeather6[0].basic
      }
      wx.hideLoading()
      // console.log(this.cityData)
    },
    ...mapMutations([
      'SET_CITY',
      'CHANGE_CURRENT_CITY'
    ])
  }
}
</script>

<style>
page{
  background-color: #f1f1f1;
}
.query_header{
  display: flex;
  align-items: center;
}
.query_list{
  height: 70rpx;
  width: 700rpx;
  margin-left: 25rpx;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #ddd;
  line-height: 70rpx;
}
.query_main{
  padding-top: 40rpx;
}
.query_tips{
  color: #999;
  display: block;
  width: 750rpx;
  text-align: center;
  margin-top: 60rpx
}
.query_title{
  color: #999;
  margin-top: 40rpx;
  margin-left: 30rpx;
}
.city_wrap{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 37.5rpx;
}
.current_city{
  margin-left: 37.5rpx;
  border: 1rpx solid rgb(22, 136, 236) !important;
}
.city_item{
  width: 200rpx;
  height: 70rpx;
  border-radius: 10rpx;
  background-color: #FFF;
  text-align: center;
  line-height: 70rpx;
  border: 1rpx solid #ddd;
  margin-top: 20rpx;
}
.search_wrap{
  flex:1;
  height: 70rpx;
  border: 1px solid #ddd;
  background-color: #fff;
  border-radius: 70rpx;
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  flex-direction: row;
  margin-left: 30rpx;
}
.search_text{
  margin-right: 30rpx;
  margin-left: 15rpx;
  position: relative;
  top: 8rpx;
  color: rgb(22, 136, 236)
}
.search_icon {
  margin-left: 15rpx;
}
.search_icon img{
  height: 16px;
  width: 16px;
}
.search_input{
  flex:1;
  margin-left: 20rpx;
  background-color:red;
  margin-right: 40rpx;
  height: 40rpx;
  border-radius: 6rpx;
  border: 1px slid #fff;
  background-color: #fff;
  margin-left: 10rpx;
}
</style>
