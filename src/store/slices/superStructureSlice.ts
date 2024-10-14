import { createSlice } from '@reduxjs/toolkit'

const superStructureSlice = createSlice({
  name: 'superStructure',
  initialState: {
    superStructureData: [],
  },
  reducers: {
    setSuperStructureData: (state, action) => {
      state.superStructureData = action.payload
    },
    deleteSuperStructure: (state, action) => {
      state.superStructureData = state.superStructureData.filter(
        (superStructure: any) => superStructure.id !== action.payload
      )
    },
  },
})

export const { setSuperStructureData, deleteSuperStructure } =
  superStructureSlice.actions

export default superStructureSlice.reducer
