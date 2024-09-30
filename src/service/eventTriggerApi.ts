import api from './api'

const getEventTriggers = async (query: string) => {
  const response = await api.get(`/event/trigger?${query}`)
  return response.data.data
}

const createEventTrigger = async (data: any) => {
  const response = await api.post(`/event/trigger`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.data
}

export default {
  getEventTriggers,
  createEventTrigger,
}
