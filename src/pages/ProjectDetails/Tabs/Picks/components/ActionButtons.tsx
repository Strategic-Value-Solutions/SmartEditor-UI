import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { RootState } from '@/store'
import { hasPickWriteAccess } from '@/utils'
import { Ban, Check, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

interface ActionButtonsProps {
  projectModel: any
  onSelectPick: (projectModel: any) => void
  onCompletePick: (projectModel: any) => void
  onSkipPick: (projectModel: any) => void
  handleSaveAnnotations?: () => void
  showChildren?: boolean
}

const ActionButtons = ({
  projectModel,
  onSelectPick,
  onCompletePick,
  onSkipPick,
  handleSaveAnnotations,
  showChildren = true,
}: ActionButtonsProps) => {
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )

  const handleShowSkipModal = () => {
    setShowSkipModal(true)
  }

  const handleShowCompleteModal = () => {
    if (!projectModel.fileUrl) return toast.error('No file available')
    setShowCompleteModal(true)
  }
  if (
    !hasPickWriteAccess(
      currentProject?.permission,
      projectModel?.ProjectModelAccess?.[0]?.permission
    )
  )
    return null
  return (
    <div id='project-model-toolbar'>
      <ConfirmationDialog
        title='Skip Project Model'
        message='Are you sure you want to skip this pick?'
        open={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={() => onSkipPick(projectModel)}
      />
      <ConfirmationDialog
        showCancelButton={false}
        title='Save or Complete Project Model'
        message='Save or complete this project model?'
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        confirmButtonText='Mark as Completed'
        onConfirm={() => onCompletePick(projectModel)}
        showChildren={showChildren}
      >
        <Button className='bg-blue-500' onClick={handleSaveAnnotations}>
          Save Annotations
        </Button>
      </ConfirmationDialog>
      <button
        className={`h-6 rounded p-1 text-green-400 
        }`}
        onClick={handleShowCompleteModal}
      >
        <Check size={20} id='complete-button' />
      </button>
      <button
        className={`h-6 rounded p-1 text-red-400 `}
        onClick={handleShowSkipModal}
      >
        <Ban size={15} id='skip-button' />
      </button>
      <button
        className={`h-6 rounded p-1 `}
        onClick={() => onSelectPick(projectModel)}
      >
        <Pencil size={15} id='edit-button' />
      </button>
      {/* <button
        className='h-6 rounded bg-red-400 p-1 text-white'
        onClick={() => toast.info('Coming soon')}
      >
        <Trash2 size={15} />
      </button> */}
    </div>
  )
}

export default ActionButtons
