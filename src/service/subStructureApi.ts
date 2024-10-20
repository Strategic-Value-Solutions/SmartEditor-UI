import api from './api'

const getSubStructures = async (superStructureId: string) => {
  const response = await api.get(
    `/super-structure/${superStructureId}/sub-structures`
  )
  return response.data.data
}

const getSubStructure = async (query = '') => {
  const response = await api.get(`/sub-structure/${query}`)
  return response.data.data
}

const createSubStructure = async (superStructureId: string, data: any) => {
  const response = await api.post(
    `/super-structure/${superStructureId}/sub-structures`,
    data
  )
  return response.data.data
}

const updateSubStructure = async (superStructureId: string, subStructureId: string, data: any) => {
  const response = await api.put(`/super-structure/${superStructureId}/sub-structures/${subStructureId}`, data)
  return response.data.data
}

const deleteSubStructure = async (superStructureId: string, subStructureId: string) => {
  const response = await api.delete(`/super-structure/${superStructureId}/sub-structures/${subStructureId}`)
  return response.data.data
}

const subStructures = async (subStructureId: string) => {
  const response = await api.get(
    `/sub-structure/${subStructureId}/sub-structures`
  )
  return response.data.data
}
export default {
  getSubStructures,
  getSubStructure,
  createSubStructure,
  updateSubStructure,
  deleteSubStructure,
  subStructures,
}
