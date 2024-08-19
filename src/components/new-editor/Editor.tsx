// @ts-nocheck
import { useEditor } from './CanvasContext'
import Components from './Components'
import ExtendedToolbar from './ExtendedToolbar'
import Loader from './Loader'
import SelectPick from './SelectPick'
import ImageCanvas from './canvas/ImageCanvas'
import PdfCanvas from './canvas/PdfCanvas'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import * as fabric from 'fabric'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function Editor() {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )

  const [pick, setPick] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [isDocLoading, setIsDocLoading] = useState(false)
  const [showExtendedToolbar, setShowExtendedToolbar] = useState(true)
  const [selectedFieldValues, setSelectedFieldValues] = useState([])
  const [pageDimensions, setPageDimensions] = useState({
    width: 1000,
    height: 820,
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

  const onSubmit = () => {
    if (!selectedFile) return toast.error('Please select a file')

    const fileType = selectedFile.type
    dispatch(
      updateCurrentProjectDetails({
        selectedFieldValues,
        supermodelType: pick,
      })
    )
    if (fileType.includes('pdf')) {
      editor.setFile(selectedFile)
      editor.setIsSelectFilePDF(true)
    } else {
      editor.setIsSelectFilePDF(false)
      initCanvas(1000, 820)
      editor.setFile(selectedFile)
    }
  }

  const isFileSelected = !!editor.selectedFile
  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
      <p className='text-2xl text-center p-2'>{currentProject?.projectName}</p>

      {!isFileSelected ? (
        <SelectPick
          onSubmit={onSubmit}
          pick={pick}
          setPick={setPick}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setSelectedFieldValues={setSelectedFieldValues}
        />
      ) : (
        <div className='fle w-full justify-center items-center'>
          <Components toggleExtendedToolbar={toggleExtendedToolbar} />
          <div>
            
            {editor.isSelectFilePDF ? (
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
            )}
          </div>

          {showExtendedToolbar && (
            <ExtendedToolbar toggleExtendedToolbar={toggleExtendedToolbar} />
          )}
        </div>
      )}
    </div>
  )
}
