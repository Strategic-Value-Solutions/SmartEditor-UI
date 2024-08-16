import { Toaster } from '@/components/ui/toaster'
import '@/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from './components/custom/theme-provider'

import { store } from './store'
import Router from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Router />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
