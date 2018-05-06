const state = {
    "backendURL": "http://localhost:3005/"
}

const getters = {
    backendURL: state => state.backendURL
}

export default { 
    state,
    getters
}