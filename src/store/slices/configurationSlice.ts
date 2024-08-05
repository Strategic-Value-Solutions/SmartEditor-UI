import { createSlice } from '@reduxjs/toolkit'

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('configsData')
    if (serializedState === null) {
      return {
        configsData: [
          {
            mcc: 'Model 1',
            modelName: 'Model 1',
          },
          {
            mcc: 'Model 2',
            modelName: 'Model 2',
          },
        ],
      }
    }
    const parsedState = JSON.parse(serializedState)
    return {
      configsData: Array.isArray(parsedState.configsData)
        ? parsedState.configsData
        : [],
    }
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      configsData: [
        {
          mcc: 'Model 1',
          modelName: 'Model 1',
        },
        {
          mcc: 'Model 2',
          modelName: 'Model 2',
        },
      ],
    }
  }
}

// Function to save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('configsData', serializedState)
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
      state.configsData.push(action.payload)
      saveState(state)
    },
    setConfigs: (state, action) => {
      state.configsData = action.payload
      saveState(state)
    },
    updateConfig: (state, action) => {
      const index = state.configsData.findIndex(
        (config: any) => config._id === action.payload._id
      )
      if (index !== -1) {
        state.configsData[index] = action.payload
      }
      saveState(state)
    },
    deleteConfig: (state, action) => {
      state.configsData = state.configsData.filter(
        (config: any) => config._id !== action.payload
      )
      saveState(state)
    },
  },
})

export const { addConfig, setConfigs, updateConfig, deleteConfig } =
  configurationSlice.actions

export default configurationSlice.reducer
