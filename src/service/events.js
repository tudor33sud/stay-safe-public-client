import axios from 'axios';
import store from '../store';

function getEvents() {
    return axios.request({
        url: `${store.getters.backendURL}/events`
    });
}

function createEvent(location, tags, description, address) {
    const locationDTO = `${location.lat},${location.lng}`
    return axios.post(`${store.getters.backendURL}/events`, {
        priority: `medium`,
        description,
        location: locationDTO,
        performerType: 'ambulance',
        tags,
        address
    })
};

function uploadAttachment(eventId, data, onUploadProgress = () => { }) {
    return axios.put(`${store.getters.backendURL}/events/${eventId}/attachments`, data, {
        onUploadProgress
    });
}

function getAttachment(eventId, attachmentId, onProgress = () => { }) {
    return axios.get(`${store.getters.backendURL}/events/${eventId}/attachments/${attachmentId}`, {
        responseType: 'arraybuffer',
        onDownloadProgress: onProgress
    });
}

function getLatLng(event) {
    const { lat, lng } = event.location;
    return {
        lat,
        lng
    }
}

module.exports = {
    getEvents,
    uploadAttachment,
    getAttachment,
    createEvent,
    getLatLng
}