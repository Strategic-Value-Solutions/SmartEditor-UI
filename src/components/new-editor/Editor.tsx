// @ts-nocheck
import { useEditor } from './CanvasContext'
import Components from './Components'
import ExtendedToolbar from './ExtendedToolbar'
import SelectPick from './SelectPick'
import ImageCanvas from './canvas/ImageCanvas'
import PdfCanvas from './canvas/PdfCanvas'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import * as fabric from 'fabric'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

export default function Editor() {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const { activePick } = currentProject
  const [pick, setPick] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [isDocLoading, setIsDocLoading] = useState(false)
  const [showExtendedToolbar, setShowExtendedToolbar] = useState(true)
  const [selectedFieldValues, setSelectedFieldValues] = useState([])
  const [pageDimensions, setPageDimensions] = useState({
    width: 1000,
    height: 820,
  })

  useEffect(() => {
    if (currentProject.config.fieldsData) {
      // Initialize the selectedFieldValues with the first value for each field
      const initialFieldValues = currentProject.config.fieldsData.map(
        (field) => ({
          fieldName: field.name,
          selectedValue: field.values[0]?.fieldValue || '',
        })
      )
      setSelectedFieldValues(initialFieldValues)
    }
  }, [currentProject.config.fieldsData])

  const handleFieldValueChange = (index, value) => {
    dispatch(
      updateCurrentProjectDetails({
        activePick: value,
      })
    )
  }

  const changePage = (offset) => {
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
    if (!activePick) return toast.error('Please select a pick')
    const fileType = selectedFile.type
    dispatch(
      updateCurrentProjectDetails({ selectedFieldValues, supermodelType: pick })
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
      {/* <p className='text-2xl text-center p-2'>{currentProject?.projectName}</p> */}

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
        <div className='fle w-full justify-center items-center overflow-hidden'>
          <Components toggleExtendedToolbar={toggleExtendedToolbar} />

          <div>
            <div className='fixed w-1/4 z-50 p-4 top-0 right-1/2 transform translate-x-1/2'>
              {currentProject?.config?.fieldsData?.map((field, index) => (
                <Select
                  key={field.name}
                  value={currentProject?.activePick}
                  onValueChange={(value: any) =>
                    handleFieldValueChange(index, value)
                  }
                >
                  <SelectTrigger className='w-full mb-2'>
                    <SelectValue placeholder='Field Value' />
                  </SelectTrigger>
                  <SelectContent>
                    {field?.values?.map((value: any, idx: any) => (
                      <SelectItem value={value.fieldValue} key={idx}>
                        {value.fieldValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
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
