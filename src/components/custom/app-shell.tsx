import { ScrollArea } from '../ui/scroll-area'
import { Layout } from './layout'
import Sidebar from './sidebar'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export default function AppShell({ children }: any) {
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.isCollapsed
  )
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      {isAuthenticated && <Sidebar isCollapsed={isCollapsed} />}

      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isAuthenticated ? (isCollapsed ? 'md:ml-14' : 'md:ml-52') : ''} h-full`}
      >
        <Layout>
          <ScrollArea>
            <Layout.Body>{children}</Layout.Body>
          </ScrollArea>
        </Layout>
      </main>
    </div>
  )
}
