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
import AdminRoute from './routes/AdminRoute'
import AuthenticationRoute from './routes/AuthenticationRoute'
import PrivateRoute from './routes/PrivateRoute'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export const paths = {
  root: {
    name: 'Landing',
    path: '/',
    roles: [], // accessible by anyone
    component: Landing,
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
}

const Router = () => {
  return (
    <BrowserRouter>
      <TourProviderComponent>
        <Routes>
          {/* Public Routes */}
          {Object.values(paths)
            .filter(
              (path) => path.roles.length === 0 && !path.isAuthenticationRoute
            )
            .map((path) => (
              <Route
                key={path.path}
                path={path.path}
                element={<path.component />}
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
