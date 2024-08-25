import api from './api'

const getProjects = async (data: any) => {
  const response = await api.get('/project', data)
  return response.data.data
}

const getProject = async (data: any) => {
  const response = await api.get('/project', data)
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

const getProjectModels = async (projectId: any) => {
  const response = await api.get(`/project/${projectId}/model`)
  return response.data.data
}

const uploadProjectModelPdf = async (
  projectId: string,
  projectModelId: string,
  data: any
) => {
  const formData = new FormData()
  const file = data.file
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

export default {
  createProject,
  updateProject,
  getProjects,
  getProject,
  deleteProject,
  getProjectModels,
  uploadProjectModelPdf,
  skipPick,
  completePick,
}
