import '@/global.css'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/custom/theme-provider'
import Router from './router'
import userApi from './service/userApi'
import { store } from './store'
import { setUser } from './store/slices/authSlice'

const App = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user) {
        ;(async () => {
          const response = await userApi.get()
          store.dispatch(setUser(response))
        })()
      } 
    }
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <Router />
        <Toaster richColors position='bottom-right' duration={2000} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
