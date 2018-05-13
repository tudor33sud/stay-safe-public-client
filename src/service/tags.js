import axios from 'axios';
import store from '../store';

function getTags() {
    return axios.request({
        url: `${store.getters.backendURL}/tags`
    });
}

function createTag(name) {
    return axios.post(`${store.getters.backendURL}/tags`, {
        name
    });
}

module.exports = {
    getTags
}