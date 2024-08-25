import { config } from '@/config/config'
import axios, { InternalAxiosRequestConfig } from 'axios'

// Define the base URL of the API
const API_BASE_URL = config.api.url

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach the access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken && config.headers) {
      const token = JSON.parse(accessToken)
      config.headers['Authorization'] = `Bearer ${token.token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle token refresh automatically
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response
//   },
//   async (error: any) => {
//     console.log(error)
//     const originalRequest = error.config

//     // Check if the error is due to an expired access token and we haven't already retried
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       const refreshToken = localStorage.getItem('refreshToken')
//       if (refreshToken) {
//         try {
//           // Request a new access token using the refresh token
//           const response = await axios.post(
//             `${API_BASE_URL}/auth/token/refresh`,
//             {
//               refreshToken: JSON.parse(refreshToken).token,
//             }
//           )

//           const { access: newAccessToken } = response.data.data

//           // Store the new access token
//           localStorage.setItem('accessToken', JSON.stringify(newAccessToken))

//           // Update the Authorization header in the original request
//           originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

//           // Retry the original request with the new access token
//           return api(originalRequest)
//         } catch (refreshError) {
//           // Handle failed token refresh, e.g., logout user
//           console.error('Token refresh failed:', refreshError)
//           // Optionally, navigate to login or perform a logout action
//         }
//       }
//     }

//     // Reject the error if it's not related to token expiration
//     return Promise.reject(error)
//   }
// )

export default api
