import axios from 'axios';
import store from '../store';

function getEvents() {
    return axios.request({
        url: `${store.getters.backendURL}/events`
    });
}

function createEvent(location, tags, description) {
    const locationDTO = `${location.lat},${location.lng}`
    return axios.post(`${store.getters.backendURL}/events`, {
        priority: `medium`,
        description,
        location: locationDTO,
        performerType: 'ambulance',
        tags
    })
};

function uploadAttachment(eventId, data, onUploadProgress = () => { }) {
    return axios.put(`${store.getters.backendURL}/events/${eventId}/attachments`, data, {
        onUploadProgress
    });
}

function getAttachment(eventId, attachmentId) {
    return axios.request({
        url: `${store.getters.backendURL}/events/${eventId}/attachments/${attachmentId}`
    })
}

function getLatLon(event) {
    const latlonString = event.location.latlon;
    const [lat, lon] = latlonString.split(',');
    return {
        lat,
        lng: lon
    }
}

module.exports = {
    getEvents,
    uploadAttachment,
    getAttachment,
    createEvent,
    getLatLon
}