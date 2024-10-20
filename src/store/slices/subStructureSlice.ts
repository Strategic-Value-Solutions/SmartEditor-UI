import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SubStructure {
  id: string
}

interface SubStructureState {
  subStructureData: SubStructure[]
}

const initialState: SubStructureState = {
  subStructureData: [],
}

const subStructureSlice = createSlice({
  name: 'subStructure',
  initialState,
  reducers: {
    setSubStructureData: (state, action: PayloadAction<SubStructure[]>) => {
      state.subStructureData = action.payload
    },
    addSubStructure: (state, action: PayloadAction<SubStructure>) => {
      state.subStructureData.push(action.payload)
    },
    updateSubStructure: (state, action: PayloadAction<SubStructure>) => {
      const index = state.subStructureData.findIndex(
        (subStructure) => subStructure.id === action.payload.id
      )
      if (index !== -1) {
        state.subStructureData[index] = {
          ...state.subStructureData[index],
          ...action.payload,
        }
      }
    },
    deleteSubStructure: (state, action: PayloadAction<string>) => {
      state.subStructureData = state.subStructureData.filter(
        (subStructure) => subStructure.id !== action.payload
      )
    },
  },
})

export const {
  setSubStructureData,
  addSubStructure,
  updateSubStructure,
  deleteSubStructure,
} = subStructureSlice.actions

export default subStructureSlice.reducer
