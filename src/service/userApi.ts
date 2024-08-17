import api from './api'

const get = async () => {
  const response = await api.get(`/user`)
  return response.data
}

const update = async (data: any) => {
  const response = await api.put(`/user`, data)
  return response.data
}

export default { get, update }
