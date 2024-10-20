import api from './api'

const getSuperStructures = async (query = '') => {
  const response = await api.get(`/super-structure?${query}`)
  return response.data.data
}

const getSuperStructure = async (query = '') => {
  const response = await api.get(`/super-structure/${query}`)
  return response.data.data
}

const createSuperStructure = async (data: any) => {
  const response = await api.post('/super-structure', data)
  return response.data.data
}

const updateSuperStructure = async (id: string, data: any) => {
  const response = await api.put(`/super-structure/${id}`, data)
  return response.data.data
}

const deleteSuperStructure = async (id: string) => {
  const response = await api.delete(`/super-structure/${id}`)
  return response.data.data
}

const subStructures = async (superStructureId: string) => {
  const response = await api.get(
    `/super-structure/${superStructureId}/sub-structures`
  )
  return response.data.data
}
export default {
  getSuperStructures,
  getSuperStructure,
  createSuperStructure,
  updateSuperStructure,
  deleteSuperStructure,
  subStructures,
}
