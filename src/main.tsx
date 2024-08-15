import { Toaster } from 'sonner'
import '@/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/custom/app-shell'
import { ThemeProvider } from './components/custom/theme-provider'

import Editor from './pages/Editor/index'
import Projects from './pages/Projects/index'
import Templates from './pages/Templates/index'
import { store } from './store'

const Root = ({ children }: any) => {
  return <AppShell>{children}</AppShell>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={
                <Root>
                  <Projects />
                </Root>
              }
            />
            <Route
              path='/editor'
              element={
                <Root>
                  <Editor />
                </Root>
              }
            />
            <Route
              path='/templates'
              element={
                <Root>
                  <Templates />
                </Root>
              }
            />
          </Routes>
        </BrowserRouter>
        {/* <RouterProvider router={router} /> */}
        <Toaster 
        richColors
        position='top-center'
        duration={2000}
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
)
