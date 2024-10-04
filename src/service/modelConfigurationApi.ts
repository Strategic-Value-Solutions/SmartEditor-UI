import api from './api'

// Fetch all model
const getModels = async () => {
  const response = await api.get('/model')
  return response.data.data
}

// Create a new model
const createModel = async (data: any) => {
  const response = await api.post('/model', data)
  return response.data.data
}

// Update an existing model
const updateModel = async (id: string, data: any) => {
  const response = await api.put(`/model/${id}`, data)
  return response.data.data
}

// Delete a model
const deleteModel = async (id: string) => {
  const response = await api.delete(`/model/${id}`)
  return response.data.data
}

// Fetch model attributes
const getModelAttributes = async () => {
  const response = await api.get('/model/attributes')
  return response.data.data
}

// Create model attributes
const createModelAttributes = async (data: any) => {
  const response = await api.post('/model/attributes', data)
  return response.data.data
}

// Delete model attributes
const deleteModelAttributes = async (data: any) => {
  const response = await api.delete('/model/attributes', { data })
  return response.data.data
}

export default {
  getModels,
  createModel,
  updateModel,
  deleteModel,
  getModelAttributes,
  createModelAttributes,
  deleteModelAttributes,
}
