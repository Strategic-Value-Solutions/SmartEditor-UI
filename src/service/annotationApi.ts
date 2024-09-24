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

const saveSingleAnnotation = async (
  projectId: string,
  projectModelId: string,
  annotation: any
) => {
  const response = await api.post(
    `/project/${projectId}/model/${projectModelId}/annotation/new`,
    annotation
  )
  return response.data.data
}

const getAnnotations = async (projectId: string, projectModelId: string) => {
  const response = await api.get(
    `/project/${projectId}/model/${projectModelId}/annotation`
  )
  return response.data.data
}

const deleteSingleAnnotation = async (
  projectId: string,
  projectModelId: string,
  annotationId: string
) => {
  const response = await api.delete(
    `/project/${projectId}/model/${projectModelId}/annotation/${annotationId}`
  )
  return response.data.data
}

const updateSingleAnnotation = async (
  projectId: string,
  projectModelId: string,
  annotationId: string,
  annotation: any
) => {
  const response = await api.put(
    `/project/${projectId}/model/${projectModelId}/annotation/update/${annotationId}`,
    annotation
  )
  return response.data.data
}

export default {
  saveAnnotations,
  getAnnotations,
  saveSingleAnnotation,
  deleteSingleAnnotation,
  updateSingleAnnotation,
}
