import EditProjectModelModal from './components/EditProjectModelModal'
import ProjectModelCard from './components/ProjectModelCard'
import StatusCapsule from '@/components/ui/status-capsule'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Ban, Check, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ListProjectModelsProps {
  showPickModal: boolean
  setShowPickModal: (value: boolean) => void
  selectedPick: any
  setSelectedPick: (value: any) => void
  projectId: string
  viewType: string
  projectModels: any[]
  handleSelectPick: (projectModel: any) => void
  handleRedirectToEditor: (projectModel: any) => void
  skipPick: (projectModel: any) => void
  completePick: (projectModel: any) => void
}

const ListProjectModels = ({
  showPickModal,
  setShowPickModal,
  selectedPick,
  setSelectedPick,
  projectId,
  viewType,
  projectModels,
  handleSelectPick,
  handleRedirectToEditor,
  skipPick,
  completePick,
}: ListProjectModelsProps) => {
  return (
    <>
      <EditProjectModelModal
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        selectedPick={selectedPick}
        setSelectedPick={setSelectedPick}
        projectId={projectId}
      />

      {viewType === 'grid' ? (
        <div className='mt-4 flex gap-4 flex-wrap'>
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
                  className={`
                     ${'bg-gray-100 dark:bg-gray-800'}
                    `}
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
                      className={`h-6 rounded p-1 text-green-400 `}
                      onClick={() => completePick(projectModel)}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      className={`h-6 rounded p-1 text-red-400 `}
                      onClick={() => skipPick(projectModel)}
                    >
                      <Ban size={15} />
                    </button>
                    <button
                      className={`h-6 rounded p-1 `}
                      onClick={() => handleSelectPick(projectModel)}
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
    </>
  )
}

export default ListProjectModels
