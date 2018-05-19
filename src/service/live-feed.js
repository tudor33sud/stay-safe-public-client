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

module.exports = {
    sendLocation
}