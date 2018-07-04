<template>
  <div class="counter-warp">
    <span>{{ msg }}</span>
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>

    <a href="/pages/index/main" class="home">去往首页</a>
  </div>
</template>

<script>
// Use Vuex
import store from './store'
// import fetch from '@/utils/fetch'
export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  data () {
    return {
      msg: 'hehe'
    }
  },
  async created () {
    // console.log(fetch)
    // const res = await fetch('http://www.weather.com.cn/data/sk/101010100.html')
    // console.log(res)
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    }
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
