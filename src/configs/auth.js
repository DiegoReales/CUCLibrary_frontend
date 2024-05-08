export default {
  baseEndpoint: 'http://diegoreales.online:8080',
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/signin',
  registerEndpoint: '/auth/signup',
  storageUserDataKeyName: 'userData',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
