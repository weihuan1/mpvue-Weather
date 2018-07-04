<template>
  <div class="container">

    <open-data type="userAvatarUrl"></open-data>
    <open-data type="userNickName" lang="zh_CN"></open-data>
    <button open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"> </button>
    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>
    <!-- <a href="/pages/logs/main" class="counter">去往Vuex示页面</a> -->
  </div>
</template>

<script>
import card from '@/components/card'
import bmap from '@/libs/bmap-wx.js'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      motto: 'My weather forecast',
      userInfo: {}
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
            resolve(res)
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
    }
  },
  async created () {
    //  全部异步获取缓存地区的所有天气
    let res = await this.getAllCity()
    console.log(res)
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
