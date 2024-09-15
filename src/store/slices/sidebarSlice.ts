import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SidebarState {
  isCollapsed: boolean
  showSidebar?: boolean
}

const initialState: SidebarState = {
  isCollapsed: true,
  showSidebar: true,
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
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload
    },
  },
})

export const { setIsCollapsed, toggleCollapsed, setCollapsedBasedOnWidth } =
  sidebarSlice.actions

export default sidebarSlice.reducer
