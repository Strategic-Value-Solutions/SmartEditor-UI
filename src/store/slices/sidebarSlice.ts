import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  isCollapsed: boolean
}

const initialState: SidebarState = {
  isCollapsed: window.innerWidth < 768, // Initialize based on window width
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setIsCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload
    },
    toggleCollapsed: (state) => {
      state.isCollapsed = !state.isCollapsed
    },
    setCollapsedBasedOnWidth: (state) => {
      state.isCollapsed = window.innerWidth < 768
    },
  },
})

export const { setIsCollapsed, toggleCollapsed, setCollapsedBasedOnWidth } =
  sidebarSlice.actions

export default sidebarSlice.reducer
