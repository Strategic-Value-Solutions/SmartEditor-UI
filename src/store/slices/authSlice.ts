import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
}

const loadState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem('authData')
    if (serializedState === null) {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isAdmin: false,
      }
    }
    return JSON.parse(serializedState) as AuthState
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
    }
  }
}

const saveState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('authData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState: AuthState = loadState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
        isAuthenticated: boolean
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = action.payload.isAuthenticated
      state.isAdmin = action.payload.user.role === 'ADMIN'
      saveState(state)
    },

    resetAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.isAdmin = false
      saveState(state)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAdmin = action.payload.role === 'ADMIN'
      saveState(state)
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.isAuthenticated = !!action.payload
      saveState(state)
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload
      saveState(state)
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
      saveState(state)
    },
  },
})

export const {
  setAuth,
  resetAuth,
  setUser,
  setAccessToken,
  setRefreshToken,
  setIsAuthenticated,
} = authSlice.actions

export default authSlice.reducer
