import * as types from '../types'
import axios from 'axios'
import store from '../../store'
import { debug } from 'util';

const state = {
    auth: undefined,
    userInfo: undefined
}

const getters = {
    auth: state => state.auth,
    userInfo: state => state.userInfo
}

const actions = {
    authLogin({ commit }, keycloakAuth) {
        store.commit(types.SECURITY_AUTH, keycloakAuth)
    },
    loadUserInfo({ commit, getters, rootGetters }, payload) {
        state.auth
            .loadUserInfo()
            .success(function (userInfo) {
                commit(types.ADD_USER_INFO, userInfo);
            })
            .error(function (error) {
                console.log(error);
            });
    },
}

const mutations = {
    [types.SECURITY_AUTH](state, keycloakAuth) {
        state.auth = keycloakAuth
        // axios.defaults.headers.common = { 'Authorization': 'Bearer ' + keycloakAuth.token }
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + keycloakAuth.token
        console.log('Token', axios.defaults.headers.common['Authorization']);
    },
    [types.ADD_USER_INFO](state, userInfo) {
        state.userInfo = userInfo;
    }
}

export default {
    state,
    actions,
    getters,
    mutations
}