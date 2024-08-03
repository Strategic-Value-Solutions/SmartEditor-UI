import { Toaster } from '@/components/ui/toaster'
import '@/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/custom/app-shell'
import { ThemeProvider } from './components/custom/theme-provider'
import { ProjectDataContextProvider } from './store/ProjectDataContext'

import Editor from './pages/Editor'
import Projects from './pages/Projects'
import Templates from './pages/Templates'

// const theme = createTheme({
//   // your theme options
// })

const Root = ({ children }: any) => {
  return (
    <>
      <AppShell>{children}</AppShell>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProjectDataContextProvider>
      {/* <ThemeProvider theme={theme}> */}
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
        <Toaster />
      </ThemeProvider>
      {/* </ThemeProvider> */}
    </ProjectDataContextProvider>
  </React.StrictMode>
)
