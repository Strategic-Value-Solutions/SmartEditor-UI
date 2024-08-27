//@ts-nocheck
import EditProjectModelModal from './components/EditProjectModelModal'
import Header from './components/Header'
import ProjectModelCard from './components/ProjectModelCard'
import Loader from '@/components/ui/Loader'
import StatusCapsule from '@/components/ui/status-capsule'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import {
  setCurrentProjectModel,
  setProjectModels,
} from '@/store/slices/projectModelSlice'
import {
  formatText,
  getStatusDotColor,
  getStatusStyles,
  getErrorMessage,
} from '@/utils'
import { red } from '@mui/material/colors'
import { Check, Ban, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const Picks = () => {
  const { projectId } = useParams()
  const [loading, setLoading] = useState(true)
  const [showPickModal, setShowPickModal] = useState(false)
  const [selectedPick, setSelectedPick] = useState<any>(null)
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { projectModels } = useSelector(
    (state: RootState) => state.projectModels
  )
  const handleSetProjectModels = (projectModels: any) => {
    dispatch(setProjectModels(projectModels))
    setLoading(false)
  }
  useEffect(() => {
    const fetchProjectModels = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjectModels(projectId)

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
    // if (!pick.fileUrl) {
    //   toast.error('No file available')
    //   return
    // }
    dispatch(setCurrentProjectModel(pick))
    navigate(`/project/${projectId}/pick/${pick.id}`)
  }

  const skipPick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.isActive) return toast.error('Project Model is not active')
      // if (!pick.fileUrl) return toast.error('Upload a file first')
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
      <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Project Models</h3>
      <Header
        viewType={viewType}
        setViewType={setViewType}
        setSearch={setSearch}
        search={search}
      />
      <EditProjectModelModal
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        selectedPick={selectedPick}
        setSelectedPick={setSelectedPick}
        projectId={projectId}
      />

      {viewType === 'grid' ? (
        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {projectModels.map((projectModel: any) => (
            <ProjectModelCard
              key={projectModel.id}
              handleSelectPick={handleSelectPick}
              handleRedirectToEditor={handleRedirectToEditor}
              skipPick={skipPick}
              completePick={completePick}
              projectModel={projectModel}
            />
          ))}
        </div>
      ) : (
        <div className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Model Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectModels.map((projectModel: any) => (
                <TableRow
                  key={projectModel.id}
                  className={`${projectModel.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  <TableCell
                    onClick={() => handleRedirectToEditor(projectModel)}
                    className='cursor-pointer'
                  >
                    {projectModel?.pickModel?.name}
                  </TableCell>
                  <TableCell>
                    <StatusCapsule
                      status={projectModel.status}
                      redirectTo={() => handleRedirectToEditor(projectModel)}
                    />
                  </TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <button
                      className={`h-6 rounded p-1 text-green-400 ${
                        projectModel.isActive
                          ? ''
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() =>
                        projectModel.isActive && completePick(projectModel)
                      }
                      disabled={!projectModel.isActive}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      className={`h-6 rounded p-1 text-red-400 ${
                        projectModel.isActive
                          ? ''
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() =>
                        projectModel.isActive && skipPick(projectModel)
                      }
                      disabled={!projectModel.isActive}
                    >
                      <Ban size={15} />
                    </button>
                    <button
                      className={`h-6 rounded p-1 ${
                        projectModel.isActive
                          ? ''
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() =>
                        projectModel.isActive && handleSelectPick(projectModel)
                      }
                      disabled={!projectModel.isActive}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className='h-6 rounded bg-red-400 p-1 text-white'
                      onClick={() => toast.info('Coming soon')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Picks
