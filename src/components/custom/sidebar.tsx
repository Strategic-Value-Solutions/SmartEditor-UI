import { Button } from '../ui/button'
import { Layout } from './layout'
import Nav from './nav'
import imageConstants from '@/constants/imageConstants'
import { sideLinks } from '@/data/sidelinks'
import { cn } from '@/lib/utils'
import { AppDispatch } from '@/store'
import { toggleCollapsed, setIsCollapsed } from '@/store/slices/sidebarSlice'
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean
  // setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({
  className,
  isCollapsed,
  // setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  const handleMouseEnter = () => {
    if (isCollapsed) {
      dispatch(setIsCollapsed(false))
      setNavOpened(true)
    }
  }

  const navigation = useNavigate()

  const handleMouseLeave = () => {
    if (!isCollapsed) {
      dispatch(setIsCollapsed(true))
      setNavOpened(false)
    }
  }

  return (
    <aside
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      className={`fixed left-0 right-0 top-0 z-50 w-full border-r-2 duration-500 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? 'md:w-14' : 'md:w-52'}`}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? 'h-svh' : ''}>
        {/* Header */}
        <Layout.Header
          sticky
          className='z-50 flex justify-between px-4 py-3 shadow-sm md:px-4'
        >
          <div className={`flex items-center ${!isCollapsed ? 'gap-2' : ''}`}>
            <img
              src={imageConstants.logo}
              onClick={() => navigation('/projects')}
              alt='AEIS'
              className='cursor-pointer'
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                borderRadius: '10px',
              }}
            />
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? 'invisible w-0' : 'visible w-auto'}`}
            >
              <span className='font-medium'>Digital</span>
              <span className='text-xs'>Architecture</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Toggle Navigation'
            aria-controls='sidebar-menu'
            aria-expanded={navOpened}
            onClick={() => {
              dispatch(toggleCollapsed())
            }}
          >
            {/* {navOpened ? <IconX /> : <IconMenu2 />} */}
            {navOpened ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id='sidebar-menu'
          className={`z-40 h-full flex-1 overflow-x-hidden ${navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'}`}
          closeNav={() => dispatch(toggleCollapsed())}
          isCollapsed={isCollapsed}
          links={sideLinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => dispatch(toggleCollapsed())}
          size='icon'
          variant='outline'
          className='absolute -right-5 top-3/4 z-50 hidden rounded-full md:inline-flex'
        >
          <ChevronsLeft
            // stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </Layout>
    </aside>
  )
}
