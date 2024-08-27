import Auth from './pages/Auth'
import Editor from './pages/Editor/index'
import Error from './pages/Error/Error'
import Picks from './pages/Picks'
import Projects from './pages/Projects'
import Templates from './pages/Templates/index'
import AuthenticationRoute from './routes/AuthenticationRoute'
import PrivateRoute from './routes/PrivateRoute'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export const paths = {
  root: {
    name: 'Authentication',
    path: '/',
    isAuth: false,
    isProtected: false,
    isAuthentication: true,
    component: Auth,
  },
  auth: {
    name: 'Authentication',
    path: '/auth',
    isAuth: false,
    isProtected: false,
    isAuthentication: true,
    component: Auth,
  },
  editor: {
    name: 'Editor',
    path: '/project/:projectId/pick/:pickId',
    isAuth: true,
    isProtected: true,
    isAuthentication: false,
    component: Editor,
  },
  projects: {
    name: 'Projects',
    path: '/projects',
    isAuth: true,
    isProtected: true,
    isAuthentication: false,
    component: Projects,
  },
  projectModel: {
    name: 'Project Model',
    path: '/project/:projectId',
    isAuth: true,
    isProtected: true,
    isAuthentication: false,
    component: Picks,
  },
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.values(paths)
          .filter((path) => path.isAuthentication)
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

        {Object.values(paths)
          .filter((path) => path.isProtected)
          .map((path) => (
            <Route
              key={path.path}
              path={path.path}
              element={
                <PrivateRoute>
                  {path.component ? (
                    <path.component />
                  ) : (
                    <Navigate to='/' replace />
                  )}
                </PrivateRoute>
              }
            />
          ))}

        {Object.values(paths)
          .filter((path) => !path.isAuthentication && !path.isProtected)
          .map((path) => (
            <Route
              key={path.path}
              path={path.path}
              element={<path.component />}
            />
          ))}
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
