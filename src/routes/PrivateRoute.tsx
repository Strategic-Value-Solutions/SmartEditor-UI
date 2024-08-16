import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Navigate } from 'react-router-dom'
import AppShell from '@/components/custom/app-shell'

const PrivateRoute = ({ children }: any) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

//   if (!isAuthenticated) {
//     return <Navigate to='/auth/sign-in' replace />
//   }

  return <AppShell>{children}</AppShell>
}

export default PrivateRoute
