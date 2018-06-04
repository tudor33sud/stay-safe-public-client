// get vue
import "babel-core/register"
import 'babel-polyfill'
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
import './global.scss';

import { MdLayout, MdDivider, MdButton, MdIcon, MdCard,MdChips, MdContent, MdDrawer, MdToolbar, MdList, MdListItem, MdAvatar, MdMenu, MdTooltip, MdEmptyState, MdSteppers, MdProgress, MdField, MdCheckbox, MdSnackbar } from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here
import VueMaterial from 'vue-material'
Vue.use(VueAxios, axios)
Vue.use(MdLayout);
Vue.use(VueSplit)
Vue.use(MdButton);
Vue.use(MdIcon);
Vue.use(MdContent);
Vue.use(MdToolbar);
Vue.use(MdList);
Vue.use(MdDrawer);
Vue.use(MdAvatar);
Vue.use(MdMenu);
Vue.use(MdDivider);
Vue.use(MdTooltip);
Vue.use(MdEmptyState);
Vue.use(MdSteppers)
Vue.use(MdSnackbar);
Vue.use(MdField);
Vue.use(MdProgress);
Vue.use(MdCheckbox);
Vue.use(MdCard);
Vue.use(MdChips)
// launch app in div with id 'app'
const appInstance = new Vue({
    el: document.getElementById("app"),
    // adding the network here is important to be able to use x-viewer in your app!
    //_network: Network, 
    router,
    store
});


