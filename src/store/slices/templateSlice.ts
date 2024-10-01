// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('templatesData')
    if (serializedState === null) {
      return {
        templatesData: [],
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      templatesData: [],
    }
  }
}

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('templatesData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState = loadState()

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    addTemplate: (state, action) => {
      const template = { ...action.payload }
      state.templatesData.push(template)
    },
    setTemplatesData: (state, action) => {
      state.templatesData = action.payload.map((template: any) => ({
        ...template,
        id: template.id,
      }))
      saveState(state)
    },

    deleteTemplate: (state, action) => {
      
      state.templatesData = state.templatesData.filter(
        (template) => template.id !== action.payload
      )
      saveState(state)
    },
    updateTemplate: (state, action) => {
      const index = state.templatesData.findIndex(
        (template: any) => template.id === action.payload.id
      )
      if (index !== -1) {
        state.templatesData[index] = action.payload
        saveState(state)
      }
    },
  },
})

export const {
  addTemplate,
  setTemplatesData,
  deleteTemplate,
  updateTemplate,
  updateCurrentTemplateDetails,
} = templateSlice.actions

export default templateSlice.reducer
