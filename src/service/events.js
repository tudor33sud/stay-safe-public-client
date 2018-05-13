import axios from 'axios';
import store from '../store';

function getEvents() {
    return axios.request({
        url: `${store.getters.backendURL}/events`
    });
}

module.exports = {
    getEvents
}