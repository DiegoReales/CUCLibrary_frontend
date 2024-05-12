import axios from 'axios'
import authConfig from '../configs/auth'

const useBackendApi = () => {
  let isAlreadyFetchingAccessToken = false
  let subscribers = []

  const axiosIns = axios.create({
    // You can add your headers here
    // ================================
    // baseURL: 'https://some-domain.com/api/',
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
    baseURL: authConfig.baseEndpoint,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const getAccessToken = () => {
    return window.localStorage.getItem(authConfig.storageTokenKeyName)
  }

  const setAccessToken = accessToken => {
    window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
  }

  const getRefreshToken = () => {
    return window.localStorage.getItem(authConfig.onTokenExpiration)
  }

  const setRefreshToken = refreshToken => {
    window.localStorage.setItem(authConfig.onTokenExpiration, refreshToken)
  }

  const onAccessTokenFetched = accessToken => {
    subscribers = subscribers.filter(callback => callback(accessToken))
  }

  const refreshToken = () => {
    return axiosIns.post('/auth/refresh-token', {
      accessToken: getAccessToken(),
      refresh_token: getRefreshToken()
    })
  }

  const closeSesion = () => {
    window.localStorage.removeItem(authConfig.storageUserDataKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)

    console.log('Enviado a inicio por token expirado')
    window.location.replace('/')
  }

  axiosIns.interceptors.request.use(
    config => {
      const accessToken = getAccessToken()

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }

      return config
    },
    error => Promise.reject(error)
  )

  // Add request/response interceptor
  axiosIns.interceptors.response.use(
    response => response,
    error => {
      const { config, response } = error
      const originalRequest = config

      if (response && response.status === 401) {
        if (response?.data?.error === 'EXPIRED' && !isAlreadyFetchingAccessToken) {
          isAlreadyFetchingAccessToken = true
          refreshToken()
            .then(({ data: r }) => {
              if (r?.accessToken) {
                isAlreadyFetchingAccessToken = false

                // Update accessToken in localStorage
                setAccessToken(r.accessToken)
                setRefreshToken(r.refreshToken)
                onAccessTokenFetched(r.accessToken)
              } else {
                closeSesion()
              }
            })
            .catch(() => {
              closeSesion()
            })
        } else {
          closeSesion()
          isAlreadyFetchingAccessToken = false
        }

        return new Promise(resolve => {
          subscribers.push(accessToken => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            resolve(axiosIns(originalRequest))
          })
        })
      }

      return Promise.reject(error)
    }
  )

  return axiosIns
}

export default useBackendApi
