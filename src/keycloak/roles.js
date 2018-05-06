import store from '../store'

export default (role) => {
  var keycloakAuth = store.getters.SECURITY_AUTH
  if (keycloakAuth.authenticated) {
    return keycloakAuth.hasResourceRole(role)
  }
  else {
    return false
  }
}
