import AppShell from '@/components/custom/app-shell'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AuthenticationRoute = ({ children }: any) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  if (isAuthenticated) {
    return <Navigate to='/projects' replace />
  }

  return <AppShell>{children}</AppShell>
}

export default AuthenticationRoute
