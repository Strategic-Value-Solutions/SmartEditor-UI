import { RootState } from '@/store'
import { LayoutDashboardIcon, LogInIcon, Menu } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../components/ui/navigation-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/ui/sheet'
import { LogoIcon } from './Icons'
import { buttonVariants } from './ui/button'
import imageConstants from '@/constants/imageConstants'

interface RouteProps {
  href: string
  label: string
}

const routeList: RouteProps[] = [
  {
    href: '#features',
    label: 'Features',
  },
  {
    href: '#testimonials',
    label: 'Testimonials',
  },
  {
    href: '#pricing',
    label: 'Pricing',
  },
  {
    href: '#faq',
    label: 'FAQ',
  },
]

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  return (
    <header className='sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background'>
      <NavigationMenu className='mx-auto'>
        <NavigationMenuList className='container h-14 px-4 w-screen flex justify-between '>
          <NavigationMenuItem className='font-bold flex'>
            <Link
              rel='noreferrer noopener'
              to='/'
              className='ml-2 font-bold text-xl flex gap-3'
            >
              <img src={imageConstants.logo} alt='AEIS' className='w-8 h-8' />
              Smart Editor
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className='flex md:hidden'>
            {/* <ModeToggle /> */}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className='px-2'>
                <Menu
                  className='flex md:hidden h-5 w-5'
                  onClick={() => setIsOpen(true)}
                >
                  <span className='sr-only'>Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className='font-bold text-xl'>
                    Shadcn/React
                  </SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col justify-center items-center gap-2 mt-4'>
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel='noreferrer noopener'
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={buttonVariants({ variant: 'ghost' })}
                    >
                      {label}
                    </a>
                  ))}
                  {isAuthenticated ? (
                    <Link
                      rel='noreferrer noopener'
                      to='/auth'
                      className={`w-[110px] border ${buttonVariants({
                        variant: 'secondary',
                      })} flex gap-2`}
                    >
                      <LayoutDashboardIcon className='mr-2 w-5 h-5' />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      rel='noreferrer noopener'
                      to='/auth'
                      className={`w-[110px] border ${buttonVariants({
                        variant: 'secondary',
                      })} flex gap-2`}
                    >
                      <span>Login</span>
                      <LogInIcon className='mr-2 w-5 h-5' />
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className='hidden md:flex gap-2'>
            {routeList.map((route: RouteProps, i) => (
              <a
                rel='noreferrer noopener'
                href={route.href}
                key={i}
                className={`text-[17px] ${buttonVariants({
                  variant: 'ghost',
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className='hidden md:flex gap-2'>
            {isAuthenticated ? (
              <Link
                rel='noreferrer noopener'
                to='/auth'
                className={`border ${buttonVariants({ variant: 'secondary' })} flex gap-2`}
              >
                <LayoutDashboardIcon className='mr-2 w-5 h-5' />
                <span>Projects</span>
              </Link>
            ) : (
              <Link
                rel='noreferrer noopener'
                to='/auth'
                className={`border ${buttonVariants({ variant: 'secondary' })} flex gap-2`}
              >
                <span>Login</span>
                <LogInIcon className='mr-2 w-5 h-5' />
              </Link>
            )}

            {/* <ModeToggle /> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
