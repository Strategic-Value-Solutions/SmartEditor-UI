import api from './api'

const saveAnnotations = async (
  projectId: string,
  projectModelId: string,
  annotations: any
) => {
  const response = await api.post(
    `/project/${projectId}/model/${projectModelId}/annotation/save`,
    annotations
  )
  return response.data.data
}

const getAnnotations = async (projectId: string, projectModelId: string) => {
  const response = await api.get(
    `/project/${projectId}/model/${projectModelId}/annotation`
  )
  return response.data.data
}

export default {
  saveAnnotations,
  getAnnotations,
}
