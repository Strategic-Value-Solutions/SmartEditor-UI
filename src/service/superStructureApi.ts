import api from './api'

const getSuperStructures = async (data: any) => {
  const response = await api.get('/super-structure', data)
  return response.data.data
}

const getSuperStructure = async (data: any) => {
  const response = await api.get('/superstructure', data)
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

export default {
  getSuperStructures,
  getSuperStructure,
  createSuperStructure,
  updateSuperStructure,
  deleteSuperStructure,
}
