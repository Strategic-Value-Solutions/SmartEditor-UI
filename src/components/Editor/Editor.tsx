// @ts-nocheck
import StatusCapsule from '../ui/status-capsule'
import { useEditor } from './CanvasContext'
import Components from './Components'
import ExtendedToolbar from './ExtendedToolbar'
import SelectPick from './SelectPick'
import PdfCanvas from './canvas/PdfCanvas'
import { PROJECT_ACCESS_ROLES } from '@/Tours/constants'
import Loader from '@/components/ui/Loader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ActionButtons from '@/pages/ProjectDetails/Tabs/Picks/components/ActionButtons'
import EditProjectModelModal from '@/pages/ProjectDetails/Tabs/Picks/components/EditProjectModelModal'
import annotationApi from '@/service/annotationApi'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import {
  setCurrentProjectModelById,
  setProjectModels,
} from '@/store/slices/projectModelSlice'
import {
  getErrorMessage,
  hasPickWriteAccess,
  hasProjectWriteAccess,
} from '@/utils'
import * as fabric from 'fabric'
import { MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function Editor() {
  const dispatch = useDispatch()
  const editor = useEditor()
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )
  const currentProjectModel = useSelector(
    (state: RootState) => state.projectModels.currentProjectModel
  )

  const { pickId, projectId } = useParams()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const pageNumber = queryParams.get('pageNumber')
  const { currentProjectModel: pick, projectModels } = useSelector(
    (state: RootState) => state.projectModels
  )
 
  const [selectedFile, setSelectedFile] = useState('')
  const [isDocLoading, setIsDocLoading] = useState(false)
  const [showExtendedToolbar, setShowExtendedToolbar] = useState(true)
  const [selectedFieldValues, setSelectedFieldValues] = useState([])
  const [showPickModal, setShowPickModal] = useState(false)
  const [selectedPick, setSelectedPick] = useState<any>(null)
  const [pageDimensions, setPageDimensions] = useState({
    width: 1000,
    height: 820,
  })
  useEffect(() => {
    setSelectedFile(pick?.fileUrl)
  }, [pick])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
      const response = await annotationApi.getAnnotations(projectId, pick.id)
      const transformedData = transformData(response)
      editor.setAnnotations(transformedData)

      if (editor.canvas) {
        editor.canvas.clear() // Clear the canvas
        if (transformedData[editor.currPage]) {
          editor.loadCanvasState(
            editor.currPage,
            transformedData[editor.currPage]
          )
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (pick.id) {
      fetchAnnotations()
    }
  }, [pick.id, pick.fileUrl])

  const handleBack = () => {
    navigate(`/project/${projectId}`)
  }

  useEffect(() => {
    if (pick && pickId !== pick.id) {
      navigate(`/project/${projectId}/pick/${pick.id}`)
    }
  }, [pickId, pick, projectId, projectModels, navigate, pick.fileUrl])

  const handleNavigate = (id) => {
    try {
      dispatch(
        setCurrentProjectModelById({
          id,
        })
      )
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSetProjectModels = (projectModels: any) => {
    dispatch(setProjectModels(projectModels))
    setLoading(false)
  }

  const skipPick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      setLoading(true)

      await projectApi.skipPick(pick.id, pick.projectId)
      toast.success('Project Model skipped')

      // Create a new array with updated models
      const updatedModels = projectModels.map(
        (projectModel: any, index: number) => {
          if (projectModel.id === pick.id) {
            // Mark the current pick as skipped and inactive
            return {
              ...projectModel,
              status: 'Skipped',
              isActive: false,
            }
          }

          // Activate the next pick if it's the one following the skipped pick
          if (
            index ===
            projectModels.findIndex((model) => model.id === pick.id) + 1
          ) {
            return {
              ...projectModel,
              isActive: true,
            }
          }

          return projectModel // Return other models unchanged
        }
      )

      // Update the state with the new project models
      handleSetProjectModels(updatedModels)
      await fetchAnnotations()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const completePick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.fileUrl) return toast.error('Upload a file first')
      setLoading(true)

      await projectApi.completePick(pick.id, pick.projectId)
      toast.success('Project Model completed')

      // Create a new array with updated models
      const updatedModels = projectModels.map(
        (projectModel: any, index: number) => {
          if (projectModel.id === pick.id) {
            // Mark the current pick as completed and inactive
            return {
              ...projectModel,
              status: 'Completed',
              isActive: false,
            }
          }

          // Activate the next pick if it's the one following the completed pick
          if (
            index ===
            projectModels.findIndex((model) => model.id === pick.id) + 1
          ) {
            return {
              ...projectModel,
              isActive: true,
            }
          }

          return projectModel // Return other models unchanged
        }
      )

      // Update the state with the new project models
      handleSetProjectModels(updatedModels)
      await fetchAnnotations()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  const handleSelectPick = (pick: any) => {
    setSelectedPick(pick)
    setShowPickModal(true)
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col w-full h-full justify-center items-center'>
      <EditProjectModelModal
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        selectedPick={selectedPick}
        setSelectedPick={setSelectedPick}
        projectId={projectId}
      />
      {/* <div className='absolute top-1 right-1/2 flex gap-2 p-1.5 items-center'>
        <div
          className='absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center'
          id='project-model-select'
        >
          <Select onValueChange={handleNavigate} value={pick?.id}>
            <SelectTrigger>
              <SelectValue placeholder='Select a page' />
            </SelectTrigger>
            <SelectContent>
              {projectModels.map((model, index) => (
                <SelectItem
                  key={model.id}
                  value={model.id}
                  disabled={model.id === pick?.id}
                  className={'border-transparent border'}
                >
                  <div className='flex items-center justify-between w-full gap-2'>
                    <span>{model.pickModel?.name}</span>
                    <StatusCapsule status={model?.status} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <button
        id='back'
        className='rounded-md bg-gray-800 px-6 py-2 text-white absolute top-20 right-2 transform -translate-x-1/2'
        onClick={handleBack}
      >
        <MoveLeft />
      </button>
      <div className='absolute top-36 right-10 flex gap-2 p-1.5 items-center border border-gray-300 rounded-md bg-gray-100 shadow-lg'>
        <ActionButtons
          projectModel={pick}
          onSelectPick={handleSelectPick}
          onCompletePick={completePick}
          onSkipPick={skipPick}
          handleSaveAnnotations={handleSaveAnnotations}
        />
      </div>
      {!pick?.fileUrl ? (
        <SelectPick
          projectId={projectId}
          currentProjectModel={pick}
          projectModels={projectModels}
        />
      ) : (
        <div className='fle w-full justify-center items-center overflow-hidden'>
          <Components toggleExtendedToolbar={toggleExtendedToolbar} />

          <div>
            <PdfCanvas
              pick={pick}
              editor={editor}
              isDocLoading={isDocLoading}
              pageDimensions={pageDimensions}
              changePage={changePage}
              setPageDimensions={setPageDimensions}
              initCanvas={initCanvas}
              setIsDocLoading={setIsDocLoading}
              handleSaveAnnotations={handleSaveAnnotations}
            />
          </div>

          {showExtendedToolbar &&
            hasPickWriteAccess(
              currentProject?.permission,
              currentProjectModel?.ProjectModelAccess?.[0]?.permission
            ) && (
              <ExtendedToolbar
                toggleExtendedToolbar={toggleExtendedToolbar}
                pick={pick}
              />
            )}
        </div>
      )}
    </div>
  )
}
