// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Auth Axios Instance
const axiosIns = axios.create({
  baseURL: authConfig.baseEndpoint,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)
        if (userData) {
          setUser(JSON.parse(userData))
        }

        // setUser({
        //   id: 1,
        //   role: 'admin',
        //   password: 'admin',
        //   fullName: 'John Doe',
        //   username: 'johndoe',
        //   email: 'admin@vuexy.com'
        // })
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axiosIns
      .post(authConfig.loginEndpoint, params)
      .then(async ({ data }) => {
        const returnUrl = router.query.returnUrl

        const userData = {
          id: data.user.id,
          role: data.user.role.name,
          password: data.accessToken,
          fullName: `${data.user.name ?? ''} ${data.user.lastname ?? ''}`,
          username: data.user.username,
          email: data.user.username,
          permissions: data.user.permissions
        }

        setUser(userData)

        if (params.rememberMe) {
          window.localStorage.setItem(authConfig.storageTokenKeyName, data.accessToken)
          window.localStorage.setItem(authConfig.onTokenExpiration, data.refreshToken)
          window.localStorage.setItem(authConfig.storageUserDataKeyName, JSON.stringify(userData))
        }

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleSignUp = (params, errorCallback) => {

    axiosIns
      .post(authConfig.registerEndpoint, params)
      .then(async ({ data }) => {


        // const userData = {
        //   email: data.email,
        //   name: data.name,
        //   lastname: data.lastname,
        //   dni: data.dni,
        //   password: data.password,
        //   passwordConfirm: data.passwordConfirmation
        // }

        // setUser(userData)
        router.replace('/login')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(authConfig.storageUserDataKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    signUp: handleSignUp,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
