import { ROLES } from '@/constants/otherConstants'
import { ArrowDownFromLineIcon, Box, LayoutDashboardIcon } from 'lucide-react'

// Ensure you have installed lucide-react and are importing the correct icons

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]

  roles?: string[]
}
export const sideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/projects',
    icon: <LayoutDashboardIcon size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Admin Panel',
    label: '',
    href: '/admin',
    icon: <Box size={18} />,
    roles: [ROLES.ADMIN],
  },
]
