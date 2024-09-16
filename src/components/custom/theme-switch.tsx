// import { IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from '../ui/button'
import { useTheme } from './theme-provider'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <DropdownMenuItem
      className='w-full flex items-center gap-2 outline-none pb-4 cursor-pointer'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? (
        <>
          <Moon size={20} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={20} />
          <span>Light Mode</span>
        </>
      )}
    </DropdownMenuItem>
  )
}
