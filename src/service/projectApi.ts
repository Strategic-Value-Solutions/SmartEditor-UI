import api from './api'

const getProjects = async (query = '') => {
  const response = await api.get(`/project?${query}`)
  return response.data.data
}

const getCompletedProjects = async (query = '') => {
  const response = await api.get(`/project/completed?${query}`)
  return response.data.data
}

const getRecentProjects = async (query = '') => {
  const response = await api.get(`/project/recent?${query}`)
  return response.data.data
}

const getSharedProjects = async (query = '') => {
  const response = await api.get(`/project/shared?${query}`)
  return response.data.data
}

const getProject = async (query = '') => {
  const response = await api.get(`/project/${query}`)
  return response.data.data
}

const createProject = async (data: any) => {
  const response = await api.post('/project', data)
  return response.data.data
}

const updateProject = async (projectId: string, data: any) => {
  const response = await api.put(`/project/${projectId}`, data)
  return response.data.data
}

const deleteProject = async (projectId: any) => {
  const response = await api.delete(`/project/${projectId}`)
  return response.data.data
}

const getAnalytics = async (projectId: any) => {
  const response = await api.get(`/project/${projectId}/analytics`)
  return response.data.data
}

const getAnalyticsData = async (projectId: any) => {
  const response = await api.get(`/project/${projectId}/analytics/data`)
  return response.data.data
}

const getProjectModels = async (projectId: any) => {
  const response = await api.get(`/project/${projectId}/model`)
  return response.data.data
}

const getPickModelComponents = async (projectId: any, projectModelId: any) => {
  const response = await api.get(
    `/project/${projectId}/model/${projectModelId}/component`
  )
  return response.data.data
}

const uploadProjectModelPdf = async (
  projectId: string,
  projectModelId: string,
  file: File
) => {
  const formData = new FormData()

  formData.append('document', file)
  const response = await api.post(
    `/project/${projectId}/model/${projectModelId}/upload-pdf`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data.data
}

const skipPick = async (projectModelId: string, projectId: string) => {
  const response = await api.put(
    `/project/${projectId}/model/${projectModelId}/skip`
  )
  return response.data.data
}

const completePick = async (projectModelId: string, projectId: string) => {
  const response = await api.put(
    `/project/${projectId}/model/${projectModelId}/complete`
  )
  return response.data.data
}

const downloadReport = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/report`, {
    responseType: 'blob',
  })

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `project_${projectId}_report.xlsx`)
  document.body.appendChild(link)
  link.click()
  link?.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(url)
  return response.data.data
}

const getSettings = async (projectId: string) => {
  const response = await api.get(`/project/${projectId}/settings`)
  return response.data.data
}

const updateSettings = async (projectId: string, data: any) => {
  const response = await api.put(`/project/${projectId}/settings`, data)
  return response.data.data
}

const createProjectModel = async (projectId: string, data: any) => {
  const response = await api.post(`/project/${projectId}/model`, data)
  return response.data.data
}

export default {
  createProject,
  updateProject,
  getProjects,
  getAnalytics,
  getAnalyticsData,
  getCompletedProjects,
  getRecentProjects,
  getSharedProjects,
  getProject,
  deleteProject,
  getProjectModels,
  uploadProjectModelPdf,
  skipPick,
  completePick,
  getPickModelComponents,
  downloadReport,
  getSettings,
  updateSettings,
  createProjectModel,
}
