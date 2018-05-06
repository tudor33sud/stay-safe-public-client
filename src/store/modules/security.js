import * as types from '../types'
import axios from 'axios'
import store from '../../store'
import { debug } from 'util';

const state = { 
    auth: undefined
}

const getters = {
    auth: state => state.auth 
}

const actions = {
    authLogin ({ commit }, keycloakAuth) {
        store.commit(types.SECURITY_AUTH, keycloakAuth)
    }
}

const mutations = {
    [types.SECURITY_AUTH] (state, keycloakAuth) { 
        state.auth = keycloakAuth
        // axios.defaults.headers.common = { 'Authorization': 'Bearer ' + keycloakAuth.token }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + keycloakAuth.token
        console.log('Token', axios.defaults.headers.common['Authorization']);
    }
}

export default { 
    state,
    actions,
    getters,
    mutations
}