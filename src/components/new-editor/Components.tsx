// @ts-nocheck
import { useEditor } from './CanvasContext'
import imageConstants from '@/constants/imageConstants'
import {
  File,
  FileJson,
  FileText,
  Image,
  ImageDown,
  MonitorUp,
  Save,
} from 'lucide-react'
import React, { useState } from 'react'

export default function Components({ toggleExtendedToolbar }) {
  const editor = useEditor()
  const [openColor, setOpenColor] = useState(false)
  const [openBorderColor, setOpenBorderColor] = useState(false)
  const [openStroke, setOpenStroke] = useState(false)
  const [openExporter, setOpenExporter] = useState(false)

  const handleUploadImageClick = () => {
    // Logic for uploading image
  }

  const handleUploadPdfClick = () => {
    // Logic for uploading PDF
  }

  const clearCanvas = (canvas) => {
    // Logic for clearing the canvas
  }

  const canvasToJson = (canvas) => {
    // Logic for converting canvas to JSON
  }

  const onSaveCanvasAsImage = () => {
    // Logic for saving canvas as an image
  }

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
        onClick={() => editor.deleteBtn()}
        className='p-2 hover:bg-black rounded'
      >
        <img
          src={imageConstants.DeleteIcon}
          alt='Delete'
          className='w-6 h-6 invert'
        />
      </button>
      <div className='relative group'>
        <button className='text-white hover:bg-black p-2 rounded'>
          <MonitorUp />
        </button>
        <div className='absolute hidden group-hover:block bg-white text-black p-2 rounded shadow-lg mt-2 w-max'>
          <span
            className='block cursor-pointer hover:bg-gray-200 p-1 rounded'
            onClick={handleUploadImageClick}
          >
            Image <Image />
          </span>
          <span
            className='block cursor-pointer hover:bg-gray-200 p-1 rounded'
            onClick={handleUploadPdfClick}
          >
            PDF <FileText />
          </span>
        </div>
      </div>
      <button
        className='text-white hover:bg-black p-2 rounded'
        onClick={() => editor.downloadJSON()}
      >
        <FileJson />
      </button>
      <button
        className='text-white hover:bg-black p-2 rounded'
        onClick={onSaveCanvasAsImage}
      >
        <ImageDown />
      </button>
      <button
        className='text-white hover:bg-black p-2 rounded'
        // onClick={onSaveCanvasAsImage}
      >
        <Save />
      </button>
    </div>
  )
}
