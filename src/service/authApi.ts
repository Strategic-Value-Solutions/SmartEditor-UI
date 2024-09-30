import api from './api'

const loginWithGoogle = async (data: any) => {
  const response = await api.post('/auth/google', data)
  return response.data.data
}

const signup = async (data: any) => {
  const response = await api.post('/auth/register', data)
  return response.data.data
}

const logout = async (data: any) => {
  await api.post('/auth/logout', data)
}

const login = async (data: any) => {
  const response = await api.post('/auth/login', data)
  return response.data.data
}

const sendVerificationEmail = async (data?: any) => {
  const response = await api.post('/auth/send-verification-email', data)
  return response.data.data
}

const verifyEmail = async (query: any) => {
  const response = await api.post(`/auth/verify-email${query}`)
  return response.data.data
}

const forgotPassword = async (data: any) => {
  const response = await api.post('/auth/forgot-password', data)
  return response.data.data
}

const resetPassword = async (query: string, data: any) => {
  const response = await api.post(`/auth/reset-password${query}`, data)
  return response.data.data
}

export default {
  logout,
  loginWithGoogle,
  signup,
  login,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword,
}
