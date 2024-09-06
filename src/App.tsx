import { ThemeProvider } from './components/custom/theme-provider'
import Router from './router'
import userApi from './service/userApi'
import { store } from './store'
import { setUser } from './store/slices/authSlice'
import '@/global.css'
import { useEffect } from 'react'
import { pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

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
