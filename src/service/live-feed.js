function sendLocation(ws, lat, lng) {
    const sendLocationPayload = {
        action: "locationUpdate",
        value: {
            lat,
            lng
        }
    };
    console.log(sendLocationPayload);
    ws.send(JSON.stringify(sendLocationPayload));
}

module.exports = {
    sendLocation
}