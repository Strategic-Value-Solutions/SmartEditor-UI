// @ts-nocheck
import StatusCapsule from '../ui/status-capsule'
import { useEditor } from './CanvasContext/CanvasContext'
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
import { setIsCollapsed } from '@/store/slices/sidebarSlice'
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
  const [components, setComponents] = useState([])

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
    if (!data || data.length === 0) return {}

    const result = {}

    data.forEach((item) => {
      // Ensure that each page is initialized
      const pageNum = item.pageNumber || 1 // Default to page 1 if pageNumber is missing
      if (!result[pageNum]) {
        result[pageNum] = {
          version: item.annotationData.version || '6.1.0',
          objects: [],
        }
      }

      const groupObject = {
        ...item.annotationData,
        id: item.id,
        status: item.status, // Adding status
        type: 'group', // Ensuring the type is recognized as "Group"
        objects: item.annotationData.objects.map((childObj) => {
          return {
            ...childObj,
            // Ensure child object attributes like position, scaling, etc., are correctly retained
            left: childObj.left || 0,
            top: childObj.top || 0,
            width: childObj.width || 0,
            height: childObj.height || 0,
            fill: childObj.fill || 'transparent',
            stroke: childObj.stroke || null,
            type: childObj.type.toLowerCase(), // Ensure it's lowercase
          }
        }),
      }

      // Push the group object into the corresponding page's objects array
      result[pageNum].objects.push(groupObject)
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
      editor.setAnnotationFromDB(transformedData)
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

  const fetchComponents = async () => {
    try {
      const response = await projectApi.getPickModelComponents(
        projectId,
        pickId
      )
      setComponents(response)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  useEffect(() => {
    if (pick.id) {
      Promise.all([fetchAnnotations(), fetchComponents()])
    }
  }, [pick.id, pick.fileUrl, editor.toggleAnnotationFetch])

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

      {hasPickWriteAccess(
        currentProject?.permission,
        currentProjectModel?.ProjectModelAccess?.[0]?.permission
      ) && (
        <div className='absolute  right-20 flex gap-2 top-2 items-center  rounded-md '>
          <ActionButtons
            projectModel={pick}
            onSelectPick={handleSelectPick}
            onCompletePick={completePick}
            onSkipPick={skipPick}
            handleSaveAnnotations={handleSaveAnnotations}
          />
        </div>
      )}
      {!pick?.fileUrl ? (
        <SelectPick
          projectId={projectId}
          currentProjectModel={pick}
          projectModels={projectModels}
        />
      ) : (
        <div className='flex w-full justify-center items-center overflow-hidden'>
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
                tools={components}
              />
            )}
        </div>
      )}
    </div>
  )
}
