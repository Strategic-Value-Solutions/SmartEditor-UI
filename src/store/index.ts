import annotationSlice from './slices/annotationSlice'
import authSlice from './slices/authSlice'
import modelConfigurationSlice from './slices/modelConfigurationSlice'
import projectModelSlice from './slices/projectModelSlice'
import projectSlice from './slices/projectSlice'
import sidebarSlice from './slices/sidebarSlice'
import subStructureSlice from './slices/subStructureSlice'
import superStructureSlice from './slices/superStructureSlice'
import templateSlice from './slices/templateSlice'
import { configureStore } from '@reduxjs/toolkit'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const store = configureStore({
  reducer: {
    auth: authSlice,
    annotations: annotationSlice,
    project: projectSlice,
    template: templateSlice,
    sidebar: sidebarSlice,
    modelConfiguration: modelConfigurationSlice,
    superStructure: superStructureSlice,
    subStructure: subStructureSlice,
    projectModels: projectModelSlice,
  },
})
