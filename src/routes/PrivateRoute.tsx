import AppShell from '@/components/custom/app-shell'
import { ROLES } from '@/constants/otherConstants'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  if (!user?.isEmailVerified) {
    return <Navigate to='/verify-email' replace />
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />
  }
  if (user?.role === ROLES.ADMIN) {
    return <Navigate to='/super-structure' replace />
  }

  return <AppShell>{children}</AppShell>
}

export default PrivateRoute
