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

const getAnnotationById = async (annotationId: string) => {
  const response = await api.get(`/project/annotation/${annotationId}`)
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

const getAnnotations = async (
  projectId: string,
  projectModelId: string,
  query?: string
) => {
  const response = await api.get(
    `/project/${projectId}/model/${projectModelId}/annotation${query}`
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

const deleteAnnotationByPage = async (
  projectId: string,
  projectModelId: string,
  pageNumber: number
) => {
  const response = await api.delete(
    `/project/${projectId}/model/${projectModelId}/annotation/page/${pageNumber}`
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

const getPredefinedChecklists = async () => {
  const response = await api.get(`/project/checklist`)
  return response.data.data
}

const getProjectChecklist = async (projectId: string, query?: string) => {
  const response = await api.get(`/project/${projectId}/checklist${query}`)
  return response.data.data
}

const createProjectChecklist = async (projectId: string, checklist: any) => {
  const response = await api.post(`/project/${projectId}/checklist`, checklist)
  return response.data.data
}

export default {
  saveAnnotations,
  getAnnotations,
  saveSingleAnnotation,
  deleteSingleAnnotation,
  updateSingleAnnotation,
  getAnnotationById,
  deleteAnnotationByPage,
  getPredefinedChecklists,
  createProjectChecklist,
  getProjectChecklist,
}
