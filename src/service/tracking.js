import axios from 'axios';
import store from '../store';

function getTrackingEvents() {
    return axios.request({
        url: `${store.getters.backendURL}/tracking/events`
    });
}

function performEvent(eventId) {
    return axios.put(`${store.getters.backendURL}/tracking/events/${eventId}/performer`);
};



module.exports = {
    getTrackingEvents,
    performEvent
}