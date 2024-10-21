import { ROLES } from '@/constants/otherConstants'
import {
  Building,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Mail,
  Settings2
} from 'lucide-react'

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
    icon: <LayoutDashboard size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Invitations',
    label: '',
    href: '/invitations',
    icon: <Mail size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Templates',
    label: '',
    href: '/templates',
    icon: <FileText size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Configuration',
    label: '',
    href: '/configuration',
    icon: <Settings2 size={18} />,
    roles: [ROLES.USER],
  },
  {
    title: 'Super Structure',
    label: '',
    href: '/super-structure',
    icon: <Building size={18} />,
    roles: [ROLES.ADMIN],
  },
  // {
  //   title: 'Sub Structure',
  //   label: '',
  //   href: '/sub-structure',
  //   icon: <ClipboardList size={18} />,
  //   roles: [ROLES.ADMIN],
  // },
]
