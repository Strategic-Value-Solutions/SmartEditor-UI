import { ROLES } from '@/constants/otherConstants'
import {
  ArrowDownFromLineIcon,
  Box,
  CogIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MailCheck,
} from 'lucide-react'

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
    title: 'Projects',
    label: '',
    href: '/projects',
    icon: <LayoutDashboardIcon size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Invitations',
    label: '',
    href: '/invitations',
    icon: <MailCheck size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Templates',
    label: '',
    href: '/templates',
    icon: <FileTextIcon size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Configuration',
    label: '',
    href: '/configuration',
    icon: <CogIcon size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Super Structure',
    label: '',
    href: '/super-structure',
    icon: <Box size={18} />,
    roles: [ROLES.ADMIN],
  },
]
