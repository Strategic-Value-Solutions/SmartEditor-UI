//@ts-nocheck
import ListProjectModels from './ListProjectModels'
import Header from './components/Header'
import { projectModelTour } from '@/Tours/constants'
import Loader from '@/components/ui/Loader'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import {
  setCurrentProjectModel,
  setProjectModels,
} from '@/store/slices/projectModelSlice'
import { getErrorMessage } from '@/utils'
import { useTour } from '@reactour/tour'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const ProjectModels = () => {
  const { projectId } = useParams()
  const [loading, setLoading] = useState(true)
  const [showPickModal, setShowPickModal] = useState(false)
  const [selectedPick, setSelectedPick] = useState<any>(null)
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { setIsOpen, setSteps } = useTour()
  const { projectModels } = useSelector(
    (state: RootState) => state.projectModels
  )
  const handleSetProjectModels = (projectModels: any) => {
    dispatch(setProjectModels(projectModels))
    setLoading(false)
  }
  const isProjectModelTourCompleted =
    localStorage.getItem('projectModelTourCompleted')?.toString() === 'true'

  useEffect(() => {
    const fetchProjectModels = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjectModels(projectId)
        if (!isProjectModelTourCompleted) {
          setSteps(projectModelTour)
          setIsOpen(true)
          localStorage.setItem('projectModelTourCompleted', 'true')
        }
        handleSetProjectModels(response)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchProjectModels()
  }, [projectId])

  const handleSelectPick = (pick: any) => {
    setSelectedPick(pick)
    setShowPickModal(true)
  }

  const handleRedirectToEditor = (pick: any) => {
    if (!pick) {
      toast.error('Project Model not found')
      return
    }
    dispatch(setCurrentProjectModel(pick))
    navigate(`/project/${projectId}/pick/${pick.id}`)
  }

  const skipPick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.isActive)
        return toast.error(
          'Project Model is not active but you can upload the file'
        )
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

      const activePickExists = updatedModels.some((model) => model.isActive)

      if (!activePickExists) {
        toast.success('Project has been completed')
      }

      // Update the state with the new project models
      handleSetProjectModels(updatedModels)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const completePick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.isActive) return toast.error('Project Model is not active')
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

      const activePickExists = updatedModels.some((model) => model.isActive)

      if (!activePickExists) {
        toast.success('Project has been completed')
      }

      // Update the state with the new project models
      handleSetProjectModels(updatedModels)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      {/* <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Project Models</h3> */}
      <Header
        viewType={viewType}
        setViewType={setViewType}
        setSearch={setSearch}
        search={search}
      />
      <ListProjectModels
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        selectedPick={selectedPick}
        setSelectedPick={setSelectedPick}
        projectId={projectId}
        viewType={viewType}
        projectModels={projectModels}
        handleSelectPick={handleSelectPick}
        handleRedirectToEditor={handleRedirectToEditor}
        skipPick={skipPick}
        completePick={completePick}
      />
    </div>
  )
}

export default ProjectModels
