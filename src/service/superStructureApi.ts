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
  const response = await api.post('/superstructure', data)
  return response.data.data
}

const updateSuperStructure = async (data: any) => {
  const response = await api.put('/superstructure', data)
  return response.data.data
}

const deleteSuperStructure = async (data: any) => {
  const response = await api.delete('/superstructure', data)
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
