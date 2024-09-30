import AppShell from '@/components/custom/app-shell'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const VerificationRoute = ({ children }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />
  }

  if (user?.isEmailVerified) {
    return <Navigate to='/projects' replace />
  }

  return <AppShell>{children}</AppShell>
}

export default VerificationRoute
