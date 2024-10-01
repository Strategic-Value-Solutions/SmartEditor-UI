import api from './api'

const getTemplates = async (query = '') => {
  const response = await api.get(`/template?${query}`)
  return response.data.data
}

const getTemplate = async (query = '') => {
  const response = await api.get(`/template/${query}`)
  return response.data.data
}

const createTemplate = async (data: any) => {
  const response = await api.post('/template', data)
  return response.data.data
}

const updateTemplate = async (templateId: string, data: any) => {
  const response = await api.put(`/template/${templateId}`, data)
  return response.data.data
}

const deleteTemplate = async (templateId: any) => {
  const response = await api.delete(`/template/${templateId}`)
  return response.data.data
}

export default {
  createTemplate,
  updateTemplate,
  getTemplates,
  getTemplate,
  deleteTemplate,
}
