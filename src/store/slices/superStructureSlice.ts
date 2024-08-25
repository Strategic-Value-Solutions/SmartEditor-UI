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
  },
})

export const { setSuperStructureData } = superStructureSlice.actions
    
export default superStructureSlice.reducer
