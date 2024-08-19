import { ScrollArea } from '../ui/scroll-area'
import { Layout } from './layout'
import Sidebar from './sidebar'
import { UserNav } from './user-nav'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function AppShell({ children }: any) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )
  const location = useLocation()

  const showUserName = () => {
    if (
      location.pathname.includes('project') &&
      location.pathname.includes('editor')
    ) {
      return false
    }
    return true
  }

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} />

      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-52'} h-full`}
      >
        <Layout>
          <ScrollArea>
            {/* ===== Top Heading ===== */}
            {showUserName() && (
              <Layout.Header>
                {/* <TopNav links={topNav} /> */}
                <p className='text-2xl font-semibold'>Welcome back!</p>
                <div className='ml-auto flex items-center space-x-4'>
                  {/* <Search />
                   */}
                  {/* <ThemeSwitch /> */}

                  <UserNav />
                </div>
              </Layout.Header>
            )}

            {/* ===== Main ===== */}
            <Layout.Body>{children}</Layout.Body>
          </ScrollArea>
        </Layout>
      </main>
    </div>
  )
}
