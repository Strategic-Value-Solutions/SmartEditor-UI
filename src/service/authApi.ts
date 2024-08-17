import api from './api'

const loginWithGoogle = async (data: any) => {
  const response = await api.post('/auth/google', data)
  return response.data
}

const logout = async (data: any) => {
  await api.post('/auth/logout', data)
}

export default { logout, loginWithGoogle }
