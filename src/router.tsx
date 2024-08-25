import Auth from './pages/Auth'
import Editor from './pages/Editor/index'
import Picks from './pages/Picks'
import Projects from './pages/Projects'
import Templates from './pages/Templates/index'
import PrivateRoute from './routes/PrivateRoute'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export const paths = {
  root: {
    name: 'Authentication',
    path: '/',
    isAuth: false,
    component: Auth,
  },
  auth: {
    name: 'Authentication',
    path: '/auth',
    isAuth: false,
    component: Auth,
  },
  editor: {
    name: 'Editor',
    path: '/project/:projectId/pick/:pickId',
    isAuth: true,
    component: Editor,
  },
  projects: {
    name: 'Projects',
    path: '/projects',
    isAuth: true,
    component: Projects,
  },
  templates: {
    name: 'Configs',
    path: '/configs',
    isAuth: true,
    component: Templates,
  },
  picks: {
    name: 'Picks',
    path: '/picks/:projectId',
    isAuth: true,
    component: Picks,
  },
}

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {Object.values(paths)
          .filter((path) => !path.isAuth)
          .map((path) => (
            <Route
              key={path.path}
              path={path.path}
              element={<path.component />}
            />
          ))}

        {Object.values(paths)
          .filter((path) => path.isAuth)
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
      </Routes>
    </BrowserRouter>
  )
}

export default Router
