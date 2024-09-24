//@ts-nocheck
import ListProjectModels from './ListProjectModels'
import Header from './components/Header'
import { projectModelTour } from '@/Tours/constants'
import SkeletonCard from '@/components/ui/skeleton'
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
  const [filteredModels, setFilteredModels] = useState([])
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

      setLoading(true)

      await projectApi.skipPick(pick.id, pick.projectId)
      toast.success('Project Model skipped')

      const updatedModels = projectModels.map(
        (projectModel: any, index: number) => {
          if (projectModel.id === pick.id) {
            return {
              ...projectModel,
              status: 'Skipped',
              isActive: false,
            }
          }

          if (
            index ===
            projectModels.findIndex((model) => model.id === pick.id) + 1
          ) {
            return {
              ...projectModel,
              isActive: true,
            }
          }

          return projectModel
        }
      )

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

      if (!pick.fileUrl) return toast.error('Upload a file first')
      setLoading(true)

      await projectApi.completePick(pick.id, pick.projectId)
      toast.success('Project Model completed')

      const updatedModels = projectModels.map(
        (projectModel: any, index: number) => {
          if (projectModel.id === pick.id) {
            return {
              ...projectModel,
              status: 'Completed',
              isActive: false,
            }
          }

          if (
            index ===
            projectModels.findIndex((model) => model.id === pick.id) + 1
          ) {
            return {
              ...projectModel,
              isActive: true,
            }
          }

          return projectModel
        }
      )

      handleSetProjectModels(updatedModels)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (search) {
      const filtered = projectModels.filter((model: any) =>
        model?.pickModel?.name?.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredModels(filtered)
    } else {
      setFilteredModels(projectModels)
    }
  }, [search, projectModels])

  return (
    <div className='flex flex-col'>
      <Header
        viewType={viewType}
        setViewType={setViewType}
        setSearch={setSearch}
        search={search}
      />

      {/* Show skeleton cards when loading */}
      {loading ? (
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <ListProjectModels
          showPickModal={showPickModal}
          setShowPickModal={setShowPickModal}
          selectedPick={selectedPick}
          setSelectedPick={setSelectedPick}
          projectId={projectId}
          viewType={viewType}
          projectModels={filteredModels}
          handleSelectPick={handleSelectPick}
          handleRedirectToEditor={handleRedirectToEditor}
          skipPick={skipPick}
          completePick={completePick}
        />
      )}
    </div>
  )
}

export default ProjectModels
