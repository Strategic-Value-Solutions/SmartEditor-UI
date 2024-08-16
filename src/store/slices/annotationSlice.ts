import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState: any = {
  projectAnnotations: {},
  projectSettings: {},
}

const annotationSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    addAnnotation: (state, action) => {
      const { projectId, pageNumber, object } = action.payload
      if (!state.projectAnnotations[projectId]) {
        state.projectAnnotations[projectId] = {}
      }
      if (!state.projectAnnotations[projectId][pageNumber]) {
        state.projectAnnotations[projectId][pageNumber] = []
      }
      const annotationObject = object.toObject ? object.toObject() : object
      annotationObject.id = uuidv4() // Ensure each annotation has a unique id
      state.projectAnnotations[projectId][pageNumber].push(annotationObject)
    },
    setAnnotationsForPage: (state, action) => {
      const { projectId, pageNumber, objects } = action.payload
      if (!state.projectAnnotations[projectId]) {
        state.projectAnnotations[projectId] = {}
      }
      state.projectAnnotations[projectId][pageNumber] = objects.map(
        (obj: any) => ({
          ...obj,
          id: obj.id || uuidv4(), // Ensure each annotation has a unique id
        })
      )
    },
    setProjectSettings: (state, action) => {
      const { projectId, settings } = action.payload
      state.projectSettings[projectId] = {
        ...state.projectSettings[projectId],
        ...settings,
      }
    },
    removeAnnotation: (state, action) => {
      const { projectId, pageNumber, objectId } = action.payload
      if (
        state.projectAnnotations[projectId] &&
        state.projectAnnotations[projectId][pageNumber]
      ) {
        state.projectAnnotations[projectId][pageNumber] =
          state.projectAnnotations[projectId][pageNumber].filter(
            (obj: any) => obj.id !== objectId
          )
      }
    },
    clearAnnotations: (state, action) => {
      const { projectId, pageNumber } = action.payload
      if (state.projectAnnotations[projectId]) {
        state.projectAnnotations[projectId][pageNumber] = []
      }
    },
  },
})

export const {
  addAnnotation,
  setAnnotationsForPage,
  setProjectSettings,
  removeAnnotation,
  clearAnnotations,
} = annotationSlice.actions

export default annotationSlice.reducer
