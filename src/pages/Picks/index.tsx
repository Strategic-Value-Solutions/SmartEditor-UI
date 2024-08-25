//@ts-nocheck
import EditProjectModelModal from './components/EditProjectModelModal'
import Header from './components/Header'
import ProjectModelCard from './components/ProjectModelCard'
import Loader from '@/components/ui/Loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import projectApi from '@/service/projectApi'
import {
  formatText,
  getStatusDotColor,
  getStatusStyles,
  getErrorMessage,
} from '@/utils'
import { Check, Ban, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const Picks = () => {
  const { projectId } = useParams()
  const [projectModels, setProjectModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPickModal, setShowPickModal] = useState(false)
  const [selectedPick, setSelectedPick] = useState<any>(null)
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjectModels = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjectModels(projectId)

        setProjectModels(response)
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
      toast.error('Pick not found')
      return
    }
    if (!pick.fileUrl) {
      toast.error('No file available')
      return
    }
    navigate(`/project/${projectId}/pick/${pick.id}`, {
      state: {
        pick,
      },
    })
  }

  const skipPick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.isActive) return toast.error('Pick is not active')
      setLoading(true)

      await projectApi.skipPick(pick.id, pick.projectId)
      toast.success('Pick skipped')

      setProjectModels((prevState: any) => {
        const updatedModels = prevState.map(
          (projectModel: any, index: number) => {
            if (projectModel.id === pick.id) {
              if (index + 1 < prevState.length) {
                prevState[index + 1].isActive = true
              }
              return {
                ...projectModel,
                status: 'Skipped',
                isActive: false,
              }
            }
            return projectModel
          }
        )

        return updatedModels
      })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const completePick = async (pick: any) => {
    try {
      if (!pick) return toast.error('Please select a pick')
      if (!pick.isActive) return toast.error('Pick is not active')
      if (!pick.fileUrl) return toast.error('Upload a file first')
      setLoading(true)

      await projectApi.completePick(pick.id, pick.projectId)
      toast.success('Pick completed')

      setProjectModels((prevState: any) => {
        const updatedModels = prevState.map(
          (projectModel: any, index: number) => {
            if (projectModel.id === pick.id) {
              if (index + 1 < prevState.length) {
                prevState[index + 1].isActive = true
              }
              return {
                ...projectModel,
                status: 'Completed',
                isActive: false,
              }
            }
            return projectModel
          }
        )

        return updatedModels
      })
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Picks</h3>
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
        setProjectModels={setProjectModels}
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
                <TableHead>Pick Name</TableHead>
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
                    <span
                      className={`text-sm flex items-center justify-center p-1 rounded-full ${getStatusStyles(
                        projectModel.status
                      )}`}
                      style={{
                        height: '24px',
                        padding: '0 8px',
                      }}
                      onClick={() => handleRedirectToEditor(projectModel)}
                    >
                      {formatText(projectModel.status)}
                      <span
                        className={`ml-2 w-2 h-2 rounded-full ${getStatusDotColor(
                          projectModel.status
                        )}`}
                      ></span>
                    </span>
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
                      onClick={() => toast.error('Not implemented yet')}
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
