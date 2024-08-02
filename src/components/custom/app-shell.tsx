// import { Outlet } from 'react-router-dom'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { Layout } from './layout'
import { Search } from './search'
import Sidebar from './sidebar'
import ThemeSwitch from './theme-switch'
import { TopNav } from './top-nav'
import { UserNav } from './user-nav'
import CreateNewProject from '@/pages/createNewProject'

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
  },
]

export default function AppShell({ children }: any) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout>
          {/* ===== Top Heading ===== */}
          <Layout.Header>
            {/* <TopNav links={topNav} /> */}
            <p className='text-2xl font-semibold'>Welcome back!</p>
            <div className='ml-auto flex items-center space-x-4'>
              {/* <Search />
              <ThemeSwitch /> */}
              <CreateNewProject />
              <UserNav />
            </div>
          </Layout.Header>

          {/* ===== Main ===== */}
          <Layout.Body>{children}</Layout.Body>
        </Layout>
      </main>
    </div>
  )
}
