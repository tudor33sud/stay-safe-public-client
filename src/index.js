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

import '../static//materialIcons.css'
import { MdLayout,MdDivider,MdButton, MdIcon, MdContent, MdDrawer, MdToolbar, MdList, MdListItem, MdAvatar,MdMenu , MdSpeedDial,MdTooltip, MdEmptyState, MdSteppers, MdAutocomplete,MdInput,MdProgress,MdField, MdCheckbox,MdSnackbar} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css' // This line here
import VueMaterial from 'vue-material'
Vue.use(MdLayout);
Vue.use(VueAxios, axios)
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
Vue.use(MdSpeedDial);
Vue.use(MdTooltip);
Vue.use(MdEmptyState);
Vue.use(MdSteppers)
Vue.use(MdSnackbar);
Vue.use(MdField);
Vue.use(MdProgress);
Vue.use(MdCheckbox);

// launch app in div with id 'app'
const appInstance = new Vue({
    el: document.getElementById("app"),
    // adding the network here is important to be able to use x-viewer in your app!
    //_network: Network, 
    router,
    store
});


