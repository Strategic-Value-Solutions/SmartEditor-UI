import { configureStore } from '@reduxjs/toolkit'
import annotationSlice from './slices/annotationSlice'
import configurationSlice from './slices/configurationSlice'
import projectSlice from './slices/projectSlice'

export default configureStore({
  reducer: {
    annotations: annotationSlice,
    configurations: configurationSlice,
    project: projectSlice,
  },
})
