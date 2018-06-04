import store from '../store';

const liveFeedUrl = store.getters.liveFeedUrl;
function sendLocation(ws, lat, lng) {
    const sendLocationPayload = {
        action: "locationUpdate",
        value: {
            lat,
            lng
        }
    };
    ws.send(JSON.stringify(sendLocationPayload));
}

function sendEventFinished(ws, eventId) {
    const sendEventFinishedPayload = {
        action: "finishedEvent",
        value: {
            eventId
        }
    };
    ws.send(JSON.stringify(sendEventFinishedPayload));
}

function getWS(eventId, authToken) {
    return new WebSocket(
        `${liveFeedUrl}?auth=${authToken}&eventId=${eventId}`
    );
}

function sendHealth(ws) {
    ws.send(JSON.stringify({
        type: "health",
        value: "ping"
    }));
}

module.exports = {
    sendLocation,
    sendEventFinished,
    getWS,
    sendHealth
}