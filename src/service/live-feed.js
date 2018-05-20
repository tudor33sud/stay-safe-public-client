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

module.exports = {
    sendLocation,
    sendEventFinished
}