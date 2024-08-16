// @ts-nocheck
import { createSlice } from '@reduxjs/toolkit'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('projectsData')
    if (serializedState === null) {
      return {
        projectsData: [],
        currentProject: null,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      projectsData: [],
      currentProject: null,
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

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const project = { ...action.payload } // Create a new object from the payload
      state.projectsData.push(project)
      saveState(state)
    },
    setProjectsData: (state, action) => {
      state.projectsData = action.payload.map((project: any) => ({
        ...project,
        id: project.id,
      }))
      saveState(state)
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload
      saveState(state)
    },
    deleteProject: (state, action) => {
      const project = state.projectsData.find(
        (project) => project.id === action.payload
      )
      state.projectsData = state.projectsData.filter(
        (project) => project.id !== action.payload
      )
      saveState(state)
    },
    updateProject: (state, action) => {
      const index = state.projectsData.findIndex(
        (project: any) => project.id === action.payload.id
      )
      if (index !== -1) {
        state.projectsData[index] = action.payload
        saveState(state)
      }
    },
  },
})

export const {
  addProject,
  setProjectsData,
  setCurrentProject,
  deleteProject,
  updateProject,
} = projectSlice.actions

export default projectSlice.reducer
