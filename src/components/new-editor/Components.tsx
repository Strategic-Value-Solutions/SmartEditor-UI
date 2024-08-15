// @ts-nocheck
import { useEditor } from './CanvasContext'
import imageConstants from '@/constants/imageConstants'
import debounce from 'lodash/debounce'
import {
  File,
  FileJson,
  FileText,
  Image,
  ImageDown,
  MonitorUp,
  Save,
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

export default function Components({ toggleExtendedToolbar, getInputProps }) {
  const editor = useEditor()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState('right')
  const dropdownRef = useRef(null)

  const handleDropdownToggle = (e) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const windowWidth = window.innerWidth

    // Check if there is enough space on the right, else position it to the left
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

  return (
    <div className='flex flex-col items-center justify-center gap-3 fixed right-10 bottom-28 z-50 bg-gradient-to-br from-gray-300 to-gray-400 p-4 rounded-lg shadow-lg w-20'>
      <button
        type='button'
        title='Move'
        onClick={() => editor.selectMode()}
        className='p-2 hover:bg-black rounded'
      >
        <img
          src={imageConstants.SelectIcon}
          alt='Selection mode'
          className='w-6 h-6'
        />
      </button>
      <button
        type='button'
        title='Text'
        onClick={() => editor.addText()}
        className='p-2 hover:bg-black rounded'
      >
        <img src={imageConstants.TextIcon} alt='Text' className='w-6 h-6' />
      </button>
      <button
        type='button'
        title='Eraser'
        onClick={() => editor.eraseMode()}
        className='p-2 hover:bg-black rounded'
      >
        <img
          src={imageConstants.EraserIcon}
          alt='Eraser'
          className='w-6 h-6 invert'
        />
      </button>
      <button
        type='button'
        title='Annotate'
        onClick={() => toggleExtendedToolbar()}
        className='p-2 hover:bg-black rounded'
      >
        <img
          src={imageConstants.RectangleIcon}
          alt='Rectangle'
          className='w-6 h-6'
        />
      </button>
      <button
        type='button'
        title='Clear'
        onClick={() => editor.clearCanvas()}
        className='p-2 hover:bg-black rounded'
      >
        <img
          src={imageConstants.DeleteIcon}
          alt='Delete'
          className='w-6 h-6 invert'
        />
      </button>
      <div
        className='relative'
        ref={dropdownRef}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={closeDropdown}
      >
        <button
          className='text-white hover:bg-black p-2 rounded'
          onClick={handleDropdownToggle}
        >
          <MonitorUp />
        </button>
        {isDropdownOpen && (
          <div
            className={`absolute ${
              dropdownPosition === 'right' ? 'right-full' : 'left-full'
            } bg-white text-black p-2 rounded shadow-lg mt-2 w-max`}
            onMouseEnter={() => closeDropdown.cancel()}
            onMouseLeave={closeDropdown}
          >
            <div className='flex gap-2'>
              <span
                className='cursor-pointer hover:bg-gray-200 p-1 rounded flex gap-2 justify-between w-full'
                // onClick={handleUploadImageClick}
              >
                Image
                <Image />
              </span>
            </div>
            <div
              className={`text-md  w-fullflex ${
                editor.theme ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <label
                htmlFor='pdf-upload' // Link label to input
                className='relative cursor-pointer rounded-md bg-transparent font-medium '
              >
                <span className='flex gap-2 justify-between w-full cursor-pointer hover:bg-gray-200 p-1 rounded'>
                  PDF <FileText />
                </span>
                <input
                  id='pdf-upload' // ID linked with label
                  type='file'
                  className='sr-only'
                  accept='application/pdf'
                  {...getInputProps()}
                />
              </label>
            </div>
          </div>
        )}
      </div>
      <button
        className='text-white hover:bg-black p-2 rounded'
        onClick={() => editor.downloadJSON()}
      >
        <FileJson />
      </button>
      <button
        className='text-white hover:bg-black p-2 rounded'
        onClick={() => editor.downloadPageAsImage()}
      >
        <ImageDown />
      </button>
      <button
        className='text-white hover:bg-black p-2 rounded'
        onClick={() => editor.downloadPDFWithAnnotations()}
      >
        <Save />
      </button>
    </div>
  )
}
