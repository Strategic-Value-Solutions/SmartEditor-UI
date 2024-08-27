import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Check, Ban, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
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

  const handleShowSkipModal = () => {
    if (!projectModel.isActive)
      return toast.error('Project Model is not active')
    setShowSkipModal(true)
  }

  const handleShowCompleteModal = () => {
    if (!projectModel.isActive)
      return toast.error('Project Model is not active')
    if (!projectModel.fileUrl) return toast.error('No file available')
    setShowCompleteModal(true)
  }

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
        className={`h-6 rounded p-1 text-green-400 ${
          projectModel.isActive ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={handleShowCompleteModal}
        disabled={!projectModel.isActive}
      >
        <Check size={20} />
      </button>
      <button
        className={`h-6 rounded p-1 text-red-400 ${
          projectModel.isActive ? '' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={handleShowSkipModal}
        disabled={!projectModel.isActive}
      >
        <Ban size={15} />
      </button>
      <button
        className={`h-6 rounded p-1 `}
        onClick={() => onSelectPick(projectModel)}
      >
        <Pencil size={15} />
      </button>
      <button
        className='h-6 rounded bg-red-400 p-1 text-white'
        onClick={() => toast.info('Coming soon')}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default ActionButtons
