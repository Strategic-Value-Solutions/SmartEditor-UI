import AppShell from '@/components/custom/app-shell'
import { ROLES } from '@/constants/otherConstants'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({ children }: any) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  )

  if (!isAuthenticated || user?.role !== ROLES.ADMIN) {
    return <Navigate to='/' replace />
  }

  return <AppShell>{children}</AppShell>
}

export default AdminRoute
