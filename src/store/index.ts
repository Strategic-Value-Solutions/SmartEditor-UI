import { configureStore } from '@reduxjs/toolkit'
import annotationSlice from './slices/annotationSlice'
import configurationSlice from './slices/configurationSlice'
import projectSlice from './slices/projectSlice'
import templateSlice from './slices/templateSlice'

export type RootState = ReturnType<typeof store.getState>

export const store = configureStore({
  reducer: {
    annotations: annotationSlice,
    configurations: configurationSlice,
    project: projectSlice,
    template: templateSlice,
  },
})
