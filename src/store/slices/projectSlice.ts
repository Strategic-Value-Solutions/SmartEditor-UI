// src/redux/slices/projectSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

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
      if (!project._id) {
        project._id = uuidv4() // Generate a unique ID if not present
      }
      state.projectsData.push(project)
      saveState(state)
    },
    setProjectsData: (state, action) => {
      state.projectsData = action.payload.map((project: any) => ({
        ...project,
        _id: project._id || uuidv4(), // Ensure each project has a unique ID
      }))
      saveState(state)
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload
      saveState(state)
    },
  },
})

export const { addProject, setProjectsData, setCurrentProject } =
  projectSlice.actions

export default projectSlice.reducer
