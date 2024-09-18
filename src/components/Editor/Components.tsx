// @ts-nocheck
import { useEditor } from './CanvasContext'
import { PROJECT_ACCESS_ROLES } from '@/Tours/constants'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import { hasPickWriteAccess } from '@/utils'
import debounce from 'lodash/debounce'
import {
  FileDown,
  FileJson,
  ImageDown,
  Move,
  Eraser,
  Trash2,
  Type,
} from 'lucide-react'
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
      icon: <Move className='w-6 h-6' />,
      show,
      isTopFour: true, // Add flag for top four icons
    },
    {
      title: 'Text',
      onClick: () => editor.addText(),
      icon: <Type className='w-6 h-6' />,
      show,
      isTopFour: true, // Add flag for top four icons
    },
    {
      title: 'Eraser',
      onClick: () => editor.eraseMode(),
      icon: <Eraser className='w-6 h-6' />,
      show,
      isTopFour: true, // Add flag for top four icons
    },
    {
      title: 'Clear',
      onClick: () => editor.clearCanvas(),
      icon: <Trash2 className='w-6 h-6' />,
      show,
      isTopFour: true, // Add flag for top four icons
    },
    {
      title: 'Download JSON',
      onClick: () => editor.downloadJSON(),
      icon: <FileJson className='w-6 h-6' />,
      show: true,
    },
    {
      title: 'Download Image',
      onClick: () => editor.downloadPageAsImage(),
      icon: <ImageDown className='w-6 h-6' />,
      show: true,
    },
    {
      title: 'Download PDF',
      onClick: () => editor.downloadPDFWithAnnotations(),
      icon: <FileDown className='w-6 h-6' />,
      show: true,
    },
  ]

  return (
    <div
      className={`flex flex-col items-center  gap-3 fixed  right-0 z-0 border bg-gray-100 border-gray-300 p-4  w-fit h-full overflow-y-auto`}
    >
      {actions.map(({ title, onClick, icon, show }) => {
        if (!show) return null
        return (
          <button
            id={title.replace(/\s+/g, '-')}
            key={title}
            type='button'
            title={title}
            onClick={onClick}
            className='p-1 hover:bg-gray-200 rounded white border border-gray-300 w-10 h-10 flex items-center justify-center bg-white'
            style={{
              // filter: 'invert(0)', // Make top 4 icons black
              // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            {icon}
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
