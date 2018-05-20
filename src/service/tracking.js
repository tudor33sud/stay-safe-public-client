import axios from 'axios';
import store from '../store';

function getTrackingEvents(active = false) {
    return axios.request({
        url: `${store.getters.backendURL}/tracking/events`,
        params: {
            active: active ? active : undefined
        }
    });
}

function performEvent(eventId) {
    return axios.put(`${store.getters.backendURL}/tracking/events/${eventId}/performer`);
};



module.exports = {
    getTrackingEvents,
    performEvent
}