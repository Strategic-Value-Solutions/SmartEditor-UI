// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('modelConfigurationsData')
    if (serializedState === null) {
      return {
        modelConfigurationsData: [],
        currentModelConfiguration: null,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      modelConfigurationsData: [],
      currentModelConfiguration: null,
    }
  }
}

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('modelConfigurationsData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState = loadState()

const modelConfigurationSlice = createSlice({
  name: 'modelConfiguration',
  initialState,
  reducers: {
    addModelConfiguration: (state, action) => {
      const modelConfiguration = { ...action.payload }
      state.modelConfigurationsData.push(modelConfiguration)
    },
    setModelConfigurationsData: (state, action) => {
      state.modelConfigurationsData = action.payload.map((modelConfiguration: any) => ({
        ...modelConfiguration,
        id: modelConfiguration.id,
      }))
      saveState(state)
    },
    setCurrentModelConfiguration: (state, action) => {
      state.currentModelConfiguration = action.payload
      saveState(state)
    },
    deleteModelConfiguration: (state, action) => {
      state.modelConfigurationsData = state.modelConfigurationsData.filter(
        (modelConfiguration) => modelConfiguration.id !== action.payload
      )
      saveState(state)
    },
    updateModelConfiguration: (state, action) => {
      const index = state.modelConfigurationsData.findIndex(
        (modelConfiguration: any) => modelConfiguration.id === action.payload.id
      )
      if (index !== -1) {
        state.modelConfigurationsData[index] = action.payload
        saveState(state)
      }
    },
    updateCurrentModelConfigurationDetails: (state, action) => {
      if (state.currentModelConfiguration) {
        state.currentModelConfiguration = {
          ...state.currentModelConfiguration,
          ...action.payload,
        }
        saveState(state)
      }
    },
  },
})

export const {
  addModelConfiguration,
  setModelConfigurationsData,
  setCurrentModelConfiguration,
  deleteModelConfiguration,
  updateModelConfiguration,
  updateCurrentModelConfigurationDetails,
} = modelConfigurationSlice.actions

export default modelConfigurationSlice.reducer
