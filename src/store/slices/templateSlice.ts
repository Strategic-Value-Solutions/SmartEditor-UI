// src/redux/slices/templateSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('templatesData')
    if (serializedState === null) {
      return {
        templatesData: [],
        currentTemplate: null,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      templatesData: [],
      currentTemplate: null,
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
      const template = { ...action.payload } // Create a new object from the payload
      if (!template._id) {
        template._id = uuidv4() // Generate a unique ID if not present
      }
      state.templatesData.push(template)
      saveState(state)
    },
    setTemplatesData: (state, action) => {
      state.templatesData = action.payload.map((template: any) => ({
        ...template,
        _id: template._id || uuidv4(), // Ensure each template has a unique ID
      }))
      saveState(state)
    },
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload
      saveState(state)
    },
  },
})

export const { addTemplate, setTemplatesData, setCurrentTemplate } =
  templateSlice.actions

export default templateSlice.reducer
