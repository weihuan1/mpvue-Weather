<script>
import {mapState, mapMutations} from 'vuex'
import bmap from '@/libs/bmap-wx.js'
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
    // console.log(logs)

    this.getCityData()
  },
  computed: {
    ...mapState({
      city: state => state.weather.city
    })
  },
  methods: {
    getCityData () {
      const cityData = wx.getStorageSync('city')
      if (cityData) {
        for (let i in cityData) {
          let json = {
            name: i,
            position: cityData[i]
          }
          this.SET_CITY(json)
        }
      } else {
        wx.getLocation({
          type: 'wgs84',
          success: res => {
            let str = res.longitude + ',' + res.latitude
            this.getCurrentCity(str)
          }
        })
      }
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
        success: res => {
          this.SET_CITY({name: res.currentWeather[0].currentCity, position: str})
        }
      })
    },
    ...mapMutations([
      'SET_CITY'
    ])
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  width: 750rpx;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* padding: 200rpx 0; */
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
page{
  height: 100%;
}
page text{
  font-size: 13px;
  color: #fff;
  font-family: "Helvetica Neue",Helvetica,'microsoft yahei ui', 'microsoft yahei','simhei',Arial,sans-serif
}
page view{
  font-size: 13px;
  color: #fff;
  font-family: "Helvetica Neue",Helvetica,'microsoft yahei ui', 'microsoft yahei','simhei',Arial,sans-serif
}
</style>
