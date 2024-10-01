//@ts-nocheck
import TourProviderComponent from './Tours/TourProvider'
import { ROLES } from './constants/otherConstants'
import SuperStructure from './pages/Admin/SuperStructure'
import Auth from './pages/Auth'
import Editor from './pages/Editor/index'
import Error from './pages/Error/Error'
import Landing from './pages/Landing/src/main'
import ProjectDetails from './pages/ProjectDetails'
import Invitations from './pages/ProjectInvitations'
import Projects from './pages/Projects'
import Templates from './pages/Templates'
import ForgotPassword from './pages/forgot-password'
import ProjectModelsConfiguration from './pages/projectModelsConfiguration'
import ResetPassword from './pages/reset-password'
import Signup from './pages/signup'
import VerifyEmail from './pages/verify-email'
import AdminRoute from './routes/AdminRoute'
import AuthenticationRoute from './routes/AuthenticationRoute'
import PrivateRoute from './routes/PrivateRoute'
import VerificationRoute from './routes/VerificationRoute'
import templateApi from './service/templateApi'
import { setTemplatesData } from './store/slices/templateSlice'
import { getErrorMessage } from './utils'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { toast } from 'sonner'

export const paths = {
  root: {
    name: 'Landing',
    path: '/',
    roles: [], // accessible by anyone
    component: Landing,
  },
  signup: {
    name: 'Sign Up',
    path: '/signup',
    roles: [], // accessible by anyone
    component: Signup,
  },
  auth: {
    name: 'Authentication',
    path: '/auth',
    isAuthenticationRoute: true, // Marked as an authentication route
    roles: [], // accessible by anyone
    component: Auth,
  },
  editor: {
    name: 'Editor',
    path: '/project/:projectId/pick/:pickId',
    roles: [ROLES.USER],
    component: Editor,
  },
  projects: {
    name: 'Projects',
    path: '/projects',
    roles: [ROLES.USER],
    component: Projects,
  },
  projectModelsConfiguration: {
    name: 'Project Models Configuration',
    path: '/configuration',
    roles: [ROLES.USER],
    component: ProjectModelsConfiguration,
  },
  templates: {
    name: 'Templates',
    path: '/templates',
    roles: [ROLES.USER],
    component: Templates,
  },
  invitations: {
    name: 'Invitations',
    path: '/invitations',
    roles: [ROLES.USER],
    component: Invitations,
  },
  projectModel: {
    name: 'Project Model',
    path: '/project/:projectId',
    roles: [ROLES.USER],
    component: ProjectDetails,
  },
  adminDashboard: {
    name: 'Admin Dashboard',
    path: '/admin',
    roles: [ROLES.ADMIN], // only admin can access
    component: SuperStructure, // Replace with your actual admin component
  },
  forgotPassword: {
    name: 'Forgot Password',
    path: '/forgot-password',
    roles: [], // accessible by anyone
    component: ForgotPassword,
  },
  resetPassword: {
    name: 'Reset Password',
    path: '/reset-password',
    roles: [], // accessible by anyone
    component: ResetPassword,
  },
  verifyEmail: {
    name: 'Verify Email',
    path: '/verify-email',
    roles: [],
    component: VerifyEmail,
    isVerificationRoute: true,
  },
}

const Router = () => {
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await Promise.all([templateApi.getTemplates()])
        setTemplatesData(response[0])
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    }
    fetchTemplates()
  }, [])
  return (
    <BrowserRouter>
      <TourProviderComponent>
        <Routes>
          {/* Public Routes */}
          {Object.values(paths)
            .filter(
              (path) =>
                path.roles.length === 0 &&
                !path.isAuthenticationRoute &&
                !path.isVerificationRoute
            )
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={<path.component />}
              />
            ))}

          {Object.values(paths)
            .filter((path) => path.isVerificationRoute)
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={
                  <VerificationRoute>
                    <path.component />
                  </VerificationRoute>
                }
              />
            ))}
          {/* Authentication Routes */}
          {Object.values(paths)
            .filter((path) => path.isAuthenticationRoute)
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={
                  <AuthenticationRoute>
                    <path.component />
                  </AuthenticationRoute>
                }
              />
            ))}

          {/* User Routes */}
          {Object.values(paths)
            .filter((path) => path.roles.includes(ROLES.USER))
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={
                  <PrivateRoute>
                    <path.component />
                  </PrivateRoute>
                }
              />
            ))}

          {/* Admin Routes */}
          {Object.values(paths)
            .filter((path) => path.roles.includes(ROLES.ADMIN))
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={
                  <AdminRoute>
                    <path.component />
                  </AdminRoute>
                }
              />
            ))}

          <Route path='*' element={<Error />} />
        </Routes>
      </TourProviderComponent>
    </BrowserRouter>
  )
}

export default Router
