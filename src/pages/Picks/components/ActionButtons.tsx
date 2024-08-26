import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Check, Ban, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ActionButtonsProps {
  projectModel: any
  onSelectPick: (projectModel: any) => void
  onCompletePick: (projectModel: any) => void
  onSkipPick: (projectModel: any) => void
}

const ActionButtons = ({
  projectModel,
  onSelectPick,
  onCompletePick,
  onSkipPick,
}: ActionButtonsProps) => {
  const [showSkipModal, setShowSkipModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const handleShowSkipModal = () => {
    if (!projectModel.isActive) return toast.error('Pick is not active')
    setShowSkipModal(true)
  }

  const handleShowCompleteModal = () => {
    if (!projectModel.isActive) return toast.error('Pick is not active')
    if (!projectModel.fileUrl) return toast.error('No file available')
    setShowCompleteModal(true)
  }

  return (
    <div>
      <ConfirmationDialog
        title='Skip Pick'
        message='Are you sure you want to skip this pick?'
        open={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={() => onSkipPick(projectModel)}
      />
      <ConfirmationDialog
        title='Complete Pick'
        message='Are you sure you want to complete this pick?'
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={() => onCompletePick(projectModel)}
      />
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
        onClick={() => toast.error('Not implemented yet')}
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export default ActionButtons
