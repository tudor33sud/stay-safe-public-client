import store from '../store'

export default () => {
  var keycloakAuth = store.getters.SECURITY_AUTH
  keycloakAuth.logout()
  store.dispatch('authLogout')
}
