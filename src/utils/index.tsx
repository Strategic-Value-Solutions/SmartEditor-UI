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

export async function changeSvgColor(svgUrl: string, color: string) {
  // Fetch the SVG file
  const response = await fetch(svgUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch the SVG file')
  }

  // Get the SVG text
  let svgText = await response.text()

  // Check if the SVG has a stroke attribute
  const hasStroke = /stroke="[^"]+"/.test(svgText)
  const hasFill = /fill="[^"]+"/.test(svgText)

  if (hasStroke) {
    // Modify the stroke color and stroke width
    svgText = svgText
      .replace(/stroke="[^"]+"/g, `stroke="${color}"`) // Change stroke color
      .replace(/stroke-width="[^"]+"/g, `stroke-width="1"`) // Adjust stroke width
  } else if (hasFill) {
    // If no stroke is present, modify the fill color
    svgText = svgText.replace(/fill="[^"]+"/g, `fill="${color}"`)
  } else {
    // If neither fill nor stroke is present, add a stroke with the desired color
    svgText = svgText.replace('<svg', `<svg stroke="${color}" stroke-width="1"`)
  }

  // Return the modified SVG as a base64-encoded string
  return `data:image/svg+xml;base64,${btoa(svgText)}`
}

export function isFilePdf(fileUrl: string): boolean {
  // Check if the URL contains the keyword "pdf" to identify it as a PDF
  return fileUrl?.toLowerCase().includes('.pdf')
}