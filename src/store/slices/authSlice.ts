// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authData')
    if (serializedState === null) {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    console.error('Could not load state from localStorage', err)
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    }
  }
}

const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('authData', serializedState)
  } catch (err) {
    console.error('Could not save state to localStorage', err)
  }
}

const initialState = loadState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.authData = {
        ...state.authData,
        ...action.payload,
      }
      saveState(state)
    },
    setAuth: (state, action) => {
      state.authData = {
        ...state.authData,
        auth: action.payload,
      }
      saveState(state)
    },
    setUser: (state, action) => {
      state.user = {
        ...state.authData,
        auth: action.payload,
      }
      saveState(state)
    },
    setToken: (state, action) => {
      state.user = {
        ...state.authData,
        token: action.payload,
      }
      saveState(state)
    },
    setIsAuthenticated: (state, action) => {
      state.user = {
        ...state.authData,
        isAuthenticated: action.payload,
      }
      saveState(state)
    },
  },
})

export const { setAuth, setIsAuthenticated, setToken, setUser } =
  authSlice.actions

export default authSlice.reducer
