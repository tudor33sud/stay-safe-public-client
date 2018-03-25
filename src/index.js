// get vue
import Vue from 'vue'
import store from './store'
import router from './router-config'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment'
// this method will delete vue resources when app is relaunched
// it is used at the end of this file.
import cleanAfter from 'helpers/clean-after';
import VueSplit from 'vue-split-panel'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueAxios, axios)
Vue.use(VueSplit)

// launch app in div with id 'app'
const appInstance = new Vue({
    el: document.getElementById("app"),
    // adding the network here is important to be able to use x-viewer in your app!
    //_network: Network, 
    router,
    store
});

// cleanAfter( appInstance );

