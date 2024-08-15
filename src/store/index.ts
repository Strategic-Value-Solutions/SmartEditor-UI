import annotationSlice from './slices/annotationSlice'
import configurationSlice from './slices/configurationSlice'
import projectSlice from './slices/projectSlice'
import sidebarSlice from './slices/sidebarSlice'
import templateSlice from './slices/templateSlice'
import { configureStore } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const store = configureStore({
  reducer: {
    annotations: annotationSlice,
    configurations: configurationSlice,
    project: projectSlice,
    template: templateSlice,
    sidebar: sidebarSlice,
  },
})
