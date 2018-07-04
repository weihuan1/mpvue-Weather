import Vue from 'vue'
import App from './index'
import store from '@/store'

App.store = store
const app = new Vue(App)
app.$mount()
