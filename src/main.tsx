import App from './App'
import { ThemeProvider } from './components/custom/theme-provider'
import '@/global.css'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme='dark'>
    <App />
  </ThemeProvider>
)
