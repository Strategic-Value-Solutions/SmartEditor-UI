import api from './api'

const getProjectAccess = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/access`)
  return response.data.data
}

const updateProjectAccess = async (
  projectId: string,
  projectAccessId: string,
  data: any
) => {
  const response = await api.put(
    `/project/${projectId}/access/${projectAccessId}/update`,
    data
  )
  return response.data.data
}

const deleteProjectAccess = async (
  projectId: string,
  projectAccessId: string
) => {
  const response = await api.delete(
    `/project/${projectId}/access/${projectAccessId}`
  )
  return response.data.data
}

const getProjectInvitations = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/invitation`)
  return response.data.data
}

const sendProjectInvitation = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/invite`, data)
  return response.data.data
}

const validateProjectInvitation = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/invitation/validate`)
  return response.data.data
}

const acceptProjectInvitation = async (projectId: string, query: string) => {
  const response = await api.post(`/project/${projectId}/invitation/accept${query}`)
  return response.data.data
}

const cancelProjectInvitation = async (
  projectId: string,
  projectInvitationId: string
) => {
  const response = await api.put(
    `/project/${projectId}/invitation/${projectInvitationId}/cancel`
  )
  return response.data.data
}

const getProjectModelAccess = async (projectId: string, query: string) => {
  const response = await api.get(
    `/project/${projectId}/model/access${query}`
  )
  return response.data.data
}

const updateProjectModelAccess = async (
  projectId: string,
  projectModelAccessId: string,
  data: any
) => {
  const response = await api.put(
    `/project/${projectId}/model/access/${projectModelAccessId}`,
    data
  )
  return response.data.data
}

export default {
  getProjectAccess,
  updateProjectAccess,
  deleteProjectAccess,
  getProjectInvitations,
  sendProjectInvitation,
  validateProjectInvitation,
  acceptProjectInvitation,
  cancelProjectInvitation,
  getProjectModelAccess,
  updateProjectModelAccess,
}
