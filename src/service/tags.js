import axios from 'axios';
import store from '../store';

function getTags() {
    return axios.request({
        url: `${store.getters.backendURL}/tags`
    });
}

module.exports = {
    getTags
}