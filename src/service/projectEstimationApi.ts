import api from './api'

const getProjectEstimations = async (projectId: string, query = '') => {
  const response = await api.get(`/project/${projectId}/estimation?${query}`)
  return response.data.data
}

const getProjectEstimation = async (projectId: string, query = '') => {
  const response = await api.get(`/project/${projectId}/estimation/${query}`)
  return response.data.data
}

const createProjectEstimation = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/estimation`, data)
  return response.data.data
}

const updateProjectEstimation = async (
  projectId: string,
  id: string,
  data: any
) => {
  const response = await api.put(`/project/${projectId}/estimation/${id}`, data)
  return response.data.data
}

const deleteProjectEstimation = async (projectId: string, id: string) => {
  const response = await api.delete(`/project/${projectId}/estimation/${id}`)
  return response.data.data
}

const getAnalytics = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/estimation/analytics`)
  return response.data.data
}

export default {
  getProjectEstimations,
  getProjectEstimation,
  createProjectEstimation,
  updateProjectEstimation,
  deleteProjectEstimation,
  getAnalytics,
}
