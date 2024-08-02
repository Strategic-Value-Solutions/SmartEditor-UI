import '@/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ProjectDataContextProvider } from './store/ProjectDataContext'
// import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Toaster } from '@/components/ui/toaster'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/custom/app-shell'
import { ThemeProvider } from './components/custom/theme-provider'
import HomePage from './pages/HomePage'
import EditorPage from './pages/EditorPage'

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
                  <HomePage />
                </Root>
              }
            />
            <Route
              path='/editor'
              element={
                <Root>
                  <EditorPage />
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
