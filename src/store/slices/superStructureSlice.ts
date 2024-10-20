import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SuperStructure {
  id: string
}

interface SuperStructureState {
  superStructureData: SuperStructure[]
}

const initialState: SuperStructureState = {
  superStructureData: [],
}

const superStructureSlice = createSlice({
  name: 'superStructure',
  initialState,
  reducers: {
    setSuperStructureData: (state, action: PayloadAction<SuperStructure[]>) => {
      state.superStructureData = action.payload
    },
    addSuperStructure: (state, action: PayloadAction<SuperStructure>) => {
      state.superStructureData.push(action.payload)
    },
    updateSuperStructure: (state, action: PayloadAction<SuperStructure>) => {
      const index = state.superStructureData.findIndex(
        (superStructure) => superStructure.id === action.payload.id
      )
      if (index !== -1) {
        state.superStructureData[index] = {
          ...state.superStructureData[index],
          ...action.payload,
        }
      }
    },
    deleteSuperStructure: (state, action: PayloadAction<string>) => {
      state.superStructureData = state.superStructureData.filter(
        (superStructure) => superStructure.id !== action.payload
      )
    },
  },
})

export const {
  setSuperStructureData,
  addSuperStructure,
  updateSuperStructure,
  deleteSuperStructure,
} = superStructureSlice.actions

export default superStructureSlice.reducer
