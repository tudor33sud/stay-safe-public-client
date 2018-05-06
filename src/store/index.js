import Vue from 'vue'
import Vuex from 'vuex'

import applicationProp from './modules/applicationProp'
import security from './modules/security'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({

    modules: {
        applicationProp, security

    },
    strict: debug,
    plugins: []
})