// @ts-nocheck
import imageConstants from '@/constants/imageConstants'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import debounce from 'lodash/debounce'
import { FileDown, FileJson, ImageDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEditor } from './CanvasContext'

export default function Components({ toggleExtendedToolbar, getInputProps }) {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
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
    },
    {
      title: 'Text',
      onClick: () => editor.addText(),
      icon: imageConstants.TextIcon,
    },
    {
      title: 'Eraser',
      onClick: () => editor.eraseMode(),
      icon: imageConstants.EraserIcon,
    },
    {
      title: 'Annotate',
      onClick: () => toggleExtendedToolbar(),
      icon: imageConstants.RectangleIcon,
    },
    {
      title: 'Clear',
      onClick: () => editor.clearCanvas(),
      icon: imageConstants.DeleteIcon,
    },
    {
      title: 'Download JSON',
      onClick: () => editor.downloadJSON(),
      icon: <FileJson className='w-6 h-6 text-white' />,
    },
    {
      title: 'Download Image',
      onClick: () => editor.downloadPageAsImage(),
      icon: <ImageDown />,
    },
    {
      title: 'Download PDF',
      onClick: () => editor.downloadPDFWithAnnotations(),
      icon: <FileDown />,
    },
  ]

  return (
    <div className='flex flex-col items-center justify-center gap-3 fixed right-10 bottom-20 z-50 border bg-blue-950 border-gray-400  p-4 rounded-lg w-fit max-h-[80vh] overflow-y-auto'>
      {actions.map(({ title, onClick, icon, className }) => (
        <button
          id={title.replace(/\s+/g, '-')}
          key={title}
          type='button'
          title={title}
          onClick={onClick}
          className={`p-2 hover:bg-black rounded  text-white `}
        >
          {typeof icon === 'string' ? (
            <img src={icon} alt={title} className='w-6 h-6' />
          ) : (
            icon
          )}
        </button>
      ))}
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
