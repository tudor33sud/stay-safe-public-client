import axios from 'axios';
import store from '../store';

function getEvents() {
    return axios.request({
        url: `${store.getters.backendURL}/events`
    });
}

function createEvent(location, tags, description) {
    return axios.post(`${store.getters.backendURL}/events`, {
        priority: `medium`,
        description,
        location,
        performerType: 'ambulance',
        tags
    })
};

module.exports = {
    getEvents
}