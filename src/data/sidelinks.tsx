import {
  LayoutDashboardIcon,
  SettingsIcon,
  HomeIcon,
  SearchIcon,
  SaveIcon,
  InfoIcon,
  FileIcon,
  UsersIcon,
  TrashIcon,
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
}

export const sideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/projects',
    icon: <LayoutDashboardIcon size={18} />,
  },
  // {
  //   title: 'Templates',
  //   label: '',
  //   href: '/templates',
  //   icon: <FileIcon size={18} />,
  // },
  {
    title: 'Configs',
    label: '',
    href: '/configs',
    icon: <SettingsIcon size={18} />,
  },
  // {
  //   title: 'Home',
  //   label: '',
  //   href: '/home',
  //   icon: <HomeIcon size={18} />,
  // },
  // {
  //   title: 'Search',
  //   label: '',
  //   href: '/search',
  //   icon: <SearchIcon size={18} />,
  // },
  // {
  //   title: 'Save',
  //   label: '',
  //   href: '/save',
  //   icon: <SaveIcon size={18} />,
  // },
  // {
  //   title: 'Info',
  //   label: '',
  //   href: '/info',
  //   icon: <InfoIcon size={18} />,
  // },
  // {
  //   title: 'Shared Files',
  //   label: '',
  //   href: '/shared-files',
  //   icon: <UsersIcon size={18} />,
  // },
  // {
  //   title: 'Deleted',
  //   label: '',
  //   href: '/deleted',
  //   icon: <TrashIcon size={18} />,
  // },
]
