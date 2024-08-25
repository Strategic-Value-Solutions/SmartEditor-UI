// @ts-nocheck
import { Button } from '../ui/button'
import { useEditor } from './CanvasContext'
import Components from './Components'
import ExtendedToolbar from './ExtendedToolbar'
import SelectPick from './SelectPick'
import ImageCanvas from './canvas/ImageCanvas'
import PdfCanvas from './canvas/PdfCanvas'
import Loader from '@/components/ui/Loader'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import annotationApi from '@/service/annotationApi'
import { RootState } from '@/store'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import { getErrorMessage } from '@/utils'
import * as fabric from 'fabric'
import { debounce } from 'lodash'
import { Save } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function Editor() {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const { pickId } = useParams()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const pageNumber = queryParams.get('pageNumber')

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
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (location.state?.pick) {
      setPick(location.state.pick)
      setSelectedFile(location.state.pick.fileUrl)
      editor.setSelectedFile(location.state.pick.fileUrl)
      editor.setIsSelectFilePDF(true)
    }
  }, [location.state])

  // useEffect(() => {
  //   if (currentProject.config.fieldsData) {
  //     // Initialize the selectedFieldValues with the first value for each field
  //     const initialFieldValues = currentProject.config.fieldsData.map(
  //       (field) => ({
  //         fieldName: field.name,
  //         selectedValue: field.values[0]?.fieldValue || '',
  //       })
  //     )
  //     setSelectedFieldValues(initialFieldValues)
  //   }
  // }, [currentProject.config.fieldsData])

  const handleFieldValueChange = (index, value) => {
    dispatch(
      updateCurrentProjectDetails({
        activePick: value,
      })
    )
  }

  const changePage = (offset) => {
    const page = editor.currPage
    editor.annotations[page] = editor.canvas.toObject()
    editor.setAnnotations(editor.annotations)

    const newPage = page + offset
    editor.setCurrPage(newPage)

    editor.canvas.clear()
    if (editor.annotations[newPage]) {
      editor.canvas.loadFromJSON(editor.annotations[newPage])
    }
    editor.canvas.renderAll()

    // Update the URL with the new page number
    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('pageNumber', newPage)
    navigate({
      pathname: location.pathname,
      search: newSearchParams.toString(),
    })
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

  // const onSubmit = () => {
  //   if (!selectedFile) return toast.error('Please select a file')
  //   // if (!activePick) return toast.error('Please select a pick')
  //   const fileType = selectedFile.type
  //   dispatch(
  //     updateCurrentProjectDetails({
  //       selectedFieldValues,
  //       superStructureId: pick,
  //     })
  //   )

  //   if (fileType.includes('pdf')) {
  //     editor.setSelectedFile(selectedFile)
  //     editor.setIsSelectFilePDF(true)
  //   } else {
  //     editor.setIsSelectFilePDF(false)
  //     initCanvas(1000, 820)
  //     editor.setSelectedFile(selectedFile)
  //   }
  // }

  const isFileSelected = !!editor.selectedFile

  const handleSaveAnnotations = async () => {
    try {
      setLoading(true)
      const response = await annotationApi.saveAnnotations(
        currentProject.id,
        pickId,
        {
          canvasData: editor.canvas.toJSON(),
          pageNumber: editor.currPage,
        }
      )
      await fetchAnnotations()
      toast.success('Annotations saved successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const transformData = (data) => {
    if (data.length === 0) return {}
    const result = {}
    data.forEach((item) => {
      result[item.pageNumber] = {
        version: item.canvasData.version,
        objects: item.canvasData.objects,
      }
    })

    return result
  }

  const fetchAnnotations = async () => {
    try {
      if (!pickId) {
        toast.error('Please select a pick')
        return
      }
      const response = await annotationApi.getAnnotations(
        currentProject.id,
        pickId
      )
      const transformedData = transformData(response)
      editor.setAnnotations(transformedData)
      if (editor.canvas) {
        editor.canvas.loadFromJSON(transformedData[editor.currPage])
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }
  useEffect(() => {
    fetchAnnotations()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
      {/* {!isFileSelected ? (
        <SelectPick
          onSubmit={onSubmit}
          pick={pick}
          setPick={setPick}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setSelectedFieldValues={setSelectedFieldValues}
        />
      ) : */}
      {/* ( */}
      <div className='fle w-full justify-center items-center overflow-hidden'>
        <Components toggleExtendedToolbar={toggleExtendedToolbar} />
        <div className='flex justify-end items-center gap-2'>
          {pick.status !== 'Completed' && pick.status !== 'Skipped' && (
            <Button
              className='flex h-8 items-center justify-center gap-2 p-2'
              onClick={handleSaveAnnotations}
            >
              Save
            </Button>
          )}
          <Button
            className='flex h-8 items-center justify-center gap-2 p-2'
            onClick={handleBack}
          >
            Back
          </Button>
        </div>
        <div>
          {/* <div className='fixed w-1/4 z-50 p-4 top-0 right-1/2 transform translate-x-1/2'>
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
            </div> */}
          {/* {
          editor.isSelectFilePDF ? ( */}
          <PdfCanvas
            pick={pick}
            editor={editor}
            isDocLoading={isDocLoading}
            pageDimensions={pageDimensions}
            changePage={changePage}
            setPageDimensions={setPageDimensions}
            initCanvas={initCanvas}
            setIsDocLoading={setIsDocLoading}
          />
          {/* ) */}
          {/* : (
            <ImageCanvas
              selectedFile={editor.selectedFile}
              isDocLoading={isDocLoading}
              initCanvas={initCanvas}
            />
          )} */}
        </div>

        {showExtendedToolbar && (
          <ExtendedToolbar toggleExtendedToolbar={toggleExtendedToolbar} />
        )}
      </div>
      {/* )} */}
    </div>
  )
}
