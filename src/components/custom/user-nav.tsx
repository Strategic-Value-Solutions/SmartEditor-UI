import ThemeSwitch from './theme-switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { paths } from '@/router'
import { RootState } from '@/store'
import { resetAuth } from '@/store/slices/authSlice'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export function UserNav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isCollapsed } = useSelector((state: RootState) => state.sidebar)

  const [imageError, setImageError] = useState(false)

  const logout = () => {
    const keysToKeep = [
      'editorTourCompleted',
      'projectModelTourCompleted',
      'projectTourCompleted',
    ]

    // Iterate over localStorage keys and remove all except the keysToKeep
    Object.keys(localStorage).forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })

    dispatch(resetAuth())
    navigate(paths.auth.path)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {!isCollapsed ? (
            <div className='flex justify-start text-wrap w-full h-10 border-l items-center p-1 rounded-full bg-secondary overflow-hidden cursor-pointer'>
              <Avatar className='h-8 w-8'>
                {!imageError && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    referrerPolicy='no-referrer'
                    onError={handleImageError} // Handle image error here
                  />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div className='ml-2 flex flex-col w-[8vw]'>
                <span className='text-xs truncate text-ellipsis'>
                  {user?.email}
                </span>
                <span className='text-xs text-muted-foreground'>
                  {user?.role}
                </span>
              </div>
            </div>
          ) : (
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
              <Avatar className='h-8 w-8'>
                {!imageError && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    referrerPolicy='no-referrer'
                    onError={handleImageError} // Handle image error here
                  />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <ThemeSwitch />
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium leading-none'>{user?.name}</p>
              <p className='text-xs leading-none text-muted-foreground'>
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>{/* Optional dropdown items */}</DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className='cursor-pointer'>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
