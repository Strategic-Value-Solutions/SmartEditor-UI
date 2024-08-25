import api from './api'

const get = async () => {
  const response = await api.get(`/user`)
  return response.data.data
}

const update = async (data: any) => {
  const response = await api.put(`/user`, data)
  return response.data.data
}

export default { get, update }
