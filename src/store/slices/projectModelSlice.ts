import { createSlice } from '@reduxjs/toolkit'

interface ProjectModel {
  id: string
  fileUrl: string
  [key: string]: any // Other properties
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('projectsData')
    if (serializedState === null) {
      return {
        projectModels: [], // Ensure this is `projectModels`
        currentProjectModel: null,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      projectModels: [], // Ensure this is `projectModels`
      currentProjectModel: null,
    }
  }
}

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('projectsData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState = loadState()

const projectModelSlice = createSlice({
  name: 'projectModel',
  initialState,
  reducers: {
    setProjectModels: (state, action) => {
      state.projectModels = action.payload

      // Update the currentProjectModel if it exists in the new projectModels
      if (state.currentProjectModel) {
        const updatedModel = state.projectModels.find(
          (model: ProjectModel) => model.id === state.currentProjectModel.id
        )

        if (updatedModel) {
          state.currentProjectModel = updatedModel
        } else {
          // Optionally, you can reset the currentProjectModel if it no longer exists
          state.currentProjectModel = null
        }
      }

      saveState(state)
    },
    setCurrentProjectModel: (state, action) => {
      state.currentProjectModel = action.payload
      saveState(state)
    },
    updateCurrentProjectModel: (state, action) => {
      const { id, updates } = action.payload

      // Update the currentProjectModel
      if (state.currentProjectModel && state.currentProjectModel.id === id) {
        state.currentProjectModel = {
          ...state.currentProjectModel,
          ...updates,
        }
      }

      // Also update the corresponding model in projectModels
      const modelIndex = state.projectModels.findIndex(
        (model: ProjectModel) => model.id === id
      )

      if (modelIndex !== -1) {
        state.projectModels[modelIndex] = {
          ...state.projectModels[modelIndex],
          ...updates,
        }
      }

      saveState(state)
    },
    navigateToPick: (state, action) => {
      const { direction } = action.payload

      if (!state.currentProjectModel) {
        throw new Error('Current project model is not set')
      }

      const currentIndex = state.projectModels.findIndex(
        (model: any) => model.id === state.currentProjectModel?.id
      )

      let newIndex: number | undefined
      if (direction === 'next') {
        newIndex = currentIndex + 1
      } else if (direction === 'previous') {
        newIndex = currentIndex - 1
      }

      if (
        newIndex !== undefined &&
        newIndex >= 0 &&
        newIndex < state.projectModels.length
      ) {
        const newPick = state.projectModels[newIndex]
        state.currentProjectModel = newPick
        saveState(state)
      } else {
        throw new Error('No more picks available')
      }
    },
    setCurrentProjectModelById: (state, action) => {
      const { id } = action.payload

      const newProjectModel = state.projectModels.find(
        (model: any) => model.id === id
      )

      if (newProjectModel) {
        state.currentProjectModel = newProjectModel
        saveState(state)
      } else {
        throw new Error('Project model not found')
      }
    },
  },
})

export const {
  setProjectModels,
  setCurrentProjectModel,
  updateCurrentProjectModel, // New action to update fields of the current model
  navigateToPick,
  setCurrentProjectModelById,
} = projectModelSlice.actions
export default projectModelSlice.reducer
