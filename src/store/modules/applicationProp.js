const state = {
    "backendURL": "https://api.safeinromania.com",
    "liveFeedUrl": "wss://live-feed.safeinromania.com"
    // "liveFeedUrl":"ws://localhost:8999",
    // "backendURL":"http://localhost:3005"
}

const getters = {
    backendURL: state => state.backendURL,
    liveFeedUrl: state => state.liveFeedUrl
}

export default {
    state,
    getters
}