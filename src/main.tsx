import '@/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/custom/theme-provider'
import Router from './router'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Router />
        <Toaster richColors position='top-center' duration={2000} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
