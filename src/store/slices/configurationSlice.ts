import { createSlice } from '@reduxjs/toolkit'

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('modelConfigurationsData')
    if (serializedState === null) {
      return {
        modelConfigurationsData: [],
      }
    }
    const parsedState = JSON.parse(serializedState)
    return {
      modelConfigurationsData: Array.isArray(parsedState.modelConfigurationsData)
        ? parsedState.modelConfigurationsData
        : [],
    }
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      modelConfigurationsData: [],
    }
  }
}

// Function to save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('modelConfigurationsData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState = loadState()

const configurationSlice = createSlice({
  name: 'configuration',
  initialState,
  reducers: {
    addConfig: (state, action) => {
      state.modelConfigurationsData.push(action.payload)
      saveState(state)
    },
    setConfigs: (state, action) => {
      state.modelConfigurationsData = action.payload
      saveState(state)
    },
    updateConfig: (state, action) => {
      const index = state.modelConfigurationsData.findIndex(
        (config: any) => config.id === action.payload.id
      )
      if (index !== -1) {
        state.modelConfigurationsData[index] = action.payload
        saveState(state)
      }
    },
    deleteConfig: (state, action) => {
      state.modelConfigurationsData = state.modelConfigurationsData.filter(
        (config: any) => config.id !== action.payload
      )
      saveState(state)
    },
  },
})

export const { addConfig, setConfigs, updateConfig, deleteConfig } =
  configurationSlice.actions

export default configurationSlice.reducer
