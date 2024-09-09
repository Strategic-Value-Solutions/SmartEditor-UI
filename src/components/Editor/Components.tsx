// @ts-nocheck
import { useEditor } from './CanvasContext'
import { PROJECT_ACCESS_ROLES } from '@/Tours/constants'
import imageConstants from '@/constants/imageConstants'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import { hasPickWriteAccess } from '@/utils'
import debounce from 'lodash/debounce'
import { FileDown, FileJson, ImageDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Components({ toggleExtendedToolbar, getInputProps }) {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const currentProjectModel = useSelector(
    (state: RootState) => state.projectModels.currentProjectModel
  )
  const [show, setShow] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState('right')
  const dropdownRef = useRef(null)

  const setSelectedFieldValues = (fieldValue) => {
    dispatch(
      updateCurrentProjectDetails({
        selectedFieldValue: fieldValue,
      })
    )
  }

  useEffect(() => {
    setShow(
      hasPickWriteAccess(
        currentProject?.permission,
        currentProjectModel?.ProjectModelAccess?.[0]?.permission
      )
    )
  }, [
    currentProject?.permission,
    currentProjectModel?.ProjectModelAccess?.[0]?.permission,
  ])

  const handleDropdownToggle = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const windowWidth = window.innerWidth

    if (windowWidth - rect.right < 20) {
      setDropdownPosition('left')
    } else {
      setDropdownPosition('right')
    }

    setIsDropdownOpen((prev) => !prev)
  }

  const closeDropdown = debounce(() => {
    setIsDropdownOpen(false)
  }, 300)

  useEffect(() => {
    const dropdownElement = dropdownRef.current

    if (dropdownElement) {
      dropdownElement.addEventListener('mouseleave', closeDropdown)
      dropdownElement.addEventListener('mouseenter', () => {
        closeDropdown.cancel()
      })
    }

    return () => {
      if (dropdownElement) {
        dropdownElement.removeEventListener('mouseleave', closeDropdown)
        dropdownElement.removeEventListener('mouseenter', () => {
          closeDropdown.cancel()
        })
      }
    }
  }, [dropdownRef])

  const actions = [
    {
      title: 'Move',
      onClick: () => editor.selectMode(),
      icon: imageConstants.SelectIcon,
      show,
    },
    {
      title: 'Text',
      onClick: () => editor.addText(),
      icon: imageConstants.TextIcon,
      show,
    },
    {
      title: 'Eraser',
      onClick: () => editor.eraseMode(),
      icon: imageConstants.EraserIcon,
      show,
    },
    {
      title: 'Annotate',
      onClick: () => toggleExtendedToolbar(),
      icon: imageConstants.RectangleIcon,
      show,
    },
    {
      title: 'Clear',
      onClick: () => editor.clearCanvas(),
      icon: imageConstants.DeleteIcon,
      show,
    },
    {
      title: 'Download JSON',
      onClick: () => editor.downloadJSON(),
      icon: <FileJson className='w-6 h-6 text-white' />,
      show: true,
    },
    {
      title: 'Download Image',
      onClick: () => editor.downloadPageAsImage(),
      icon: <ImageDown />,
      show: true,
    },
    {
      title: 'Download PDF',
      onClick: () => editor.downloadPDFWithAnnotations(),
      icon: <FileDown />,
      show: true,
    },
  ]

  // Calculate the number of visible items
  const visibleItems = actions.filter(({ show }) => show).length

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 fixed ${
        visibleItems <= 3 ? 'top-48' : 'bottom-20'
      } right-10 z-50 border bg-blue-950 border-gray-400 p-4 rounded-lg w-fit max-h-[80vh] overflow-y-auto`}
    >
      {actions.map(({ title, onClick, icon, className, show }) => {
        if (!show) return null
        return (
          <button
            id={title.replace(/\s+/g, '-')}
            key={title}
            type='button'
            title={title}
            onClick={onClick}
            className={`p-2 hover:bg-black rounded text-white`}
          >
            {typeof icon === 'string' ? (
              <img src={icon} alt={title} className='w-6 h-6' />
            ) : (
              icon
            )}
          </button>
        )
      })}
      <div
        className='relative'
        ref={dropdownRef}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={closeDropdown}
      >
        {/* Implement your dropdown logic here */}
      </div>
    </div>
  )
}
