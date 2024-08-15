// @ts-nocheck
import ExtendedToolbar from '../WhiteBoard/components/ExtendedToolbar'
import { useEditor } from './CanvasContext'
import Components from './Components'
import ImageCanvas from './ImageCanvas'
import Loader from './Loader'
import PdfCanvas from './PdfCanvas'
import * as fabric from 'fabric'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function FileUpload() {
  const editor = useEditor()

  const [isDocLoading, setIsDocLoading] = useState(false)
  const [showExtendedToolbar, setShowExtendedToolbar] = useState(true)
  const [pageDimensions, setPageDimensions] = useState({
    width: 1000,
    height: 820,
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      setIsDocLoading(true)
      const file = files[0]
      const fileType = file.type

      if (fileType.includes('pdf')) {
        // Handle PDF file
        editor.setFile(file)
        editor.setIsSelectFilePDF(true)
      } else {
        editor.setIsSelectFilePDF(false)
        initCanvas(1000, 820)
        editor.setFile(file)
        setIsDocLoading(false)
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  })

  function changePage(offset) {
    const page = editor.currPage
    editor.edits[page] = editor.canvas.toObject()
    editor.setEdits(editor.edits)
    editor.setCurrPage((page) => page + offset)
    editor.canvas.clear()
    editor.edits[page + offset] &&
      editor.canvas.loadFromJSON(editor.edits[page + offset])
    editor.canvas.renderAll()
  }

  const initCanvas = (width, height) => {
    return new fabric.Canvas('canvas', {
      isDrawingMode: false,
      height: height,
      width: width,
      backgroundColor: 'rgba(0,0,0,0)',
      selectionBorderColor: 'black',
    })
  }

  const toggleExtendedToolbar = () => {
    setShowExtendedToolbar((prev) => !prev)
  }

  return (
    <div className='flex w-full justify-center'>
      {editor.selectedFile && (
        <Components
          toggleExtendedToolbar={toggleExtendedToolbar}
          getInputProps={getInputProps}
        />
      )}
      {editor.selectedFile ? (
        editor.isSelectFilePDF ? (
          <PdfCanvas
            editor={editor}
            isDocLoading={isDocLoading}
            pageDimensions={pageDimensions}
            changePage={changePage}
            setPageDimensions={setPageDimensions}
            initCanvas={initCanvas}
            setIsDocLoading={setIsDocLoading}
          />
        ) : (
          <ImageCanvas
            selectedFile={editor.selectedFile}
            isDocLoading={isDocLoading}
            initCanvas={initCanvas}
          />
        )
      ) : (
        <div
          className='flex h-full w-full items-center justify-center py-8'
          {...getRootProps()}
        >
          <div className='flex h-[40vh] w-[40vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
            <div className='space-y-1 text-center'>
              <div
                className={`text-md flex ${
                  editor.theme ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <label className='relative cursor-pointer rounded-md bg-transparent font-medium text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'>
                  <span>Upload a file</span>
                </label>
                <input
                  type='file'
                  className='sr-only'
                  accept='application/pdf,image/*'
                  {...getInputProps()}
                />
                <p className='pl-1'>or drag and drop</p>
              </div>
              <p className='text-sm'>PDF or Image</p>
            </div>
          </div>
        </div>
      )}
      {editor.selectedFile && showExtendedToolbar && (
        <ExtendedToolbar toggleExtendedToolbar={toggleExtendedToolbar} />
      )}
    </div>
  )
}
