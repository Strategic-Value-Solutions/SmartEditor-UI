import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  // Auth routes
  // {
  //   path: '/sign-in',
  //   lazy: async () => ({
  //     Component: (await import('./pages/auth/sign-in')).default,
  //   }),
  // },
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('./pages/HomePage')).default,
    }),
  },
  {
    path: '/editor',
    lazy: async () => ({
      Component: (await import('./pages/EditorPage')).default,
    }),
  },

  // // Error routes
  // { path: '/500', Component: GeneralError },
  // { path: '/404', Component: NotFoundError },
  // { path: '/503', Component: MaintenanceError },
  // { path: '/401', Component: UnauthorisedError },

  // // Fallback 404 route
  // { path: '*', Component: NotFoundError },
])

export default router
