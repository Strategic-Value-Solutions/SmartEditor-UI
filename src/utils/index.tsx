import { PROJECT_ACCESS_ROLES } from '@/Tours/constants'
import { ERROR_MESSAGE } from '@/constants'

export const getErrorMessage = (error: any) => {
  console.log(error)
  return error?.response?.data?.message || ERROR_MESSAGE
}

export const formatText = (text: string) => {
  // Check if the text is in camelCase or similar format
  const formattedText = text.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Capitalize the first letter of each word
  return (
    formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase()
  )
}

export const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-700'
    case 'In Progress':
      return 'bg-blue-100 text-blue-700'
    case 'Skipped':
      return 'bg-yellow-100 text-yellow-700'
    case 'Completed':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export const getStatusDotColor = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-700'
    case 'In Progress':
      return 'bg-blue-700'
    case 'Skipped':
      return 'bg-yellow-700'
    case 'Completed':
      return 'bg-green-700'
    default:
      return 'bg-gray-700'
  }
}

export const hasPickWriteAccess = (projectRole: string, pickRole: string) => {
  if (!projectRole || !pickRole) return true
  if (
    projectRole === PROJECT_ACCESS_ROLES.OWNER ||
    projectRole === PROJECT_ACCESS_ROLES.EDITOR
  ) {
    return true
  }
  if (
    projectRole === PROJECT_ACCESS_ROLES.VIEWER &&
    (pickRole === PROJECT_ACCESS_ROLES.EDITOR ||
      pickRole === PROJECT_ACCESS_ROLES.OWNER)
  ) {
    return true
  }
  return false
}

//@ts-ignore
export const hasProjectWriteAccess = (projectRole: string) => {
  if (!projectRole) return true
  if (
    projectRole === PROJECT_ACCESS_ROLES.OWNER ||
    projectRole === PROJECT_ACCESS_ROLES.EDITOR
  ) {
    return true
  }
  return false
}
