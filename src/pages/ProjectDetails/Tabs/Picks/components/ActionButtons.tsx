import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { RootState } from '@/store'
import { hasPickWriteAccess } from '@/utils'
import { Ban, Check, EllipsisVertical, Pencil } from 'lucide-react'
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false) // State to control tooltip visibility

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

  const handleSkip = (projectModel: any) => {
    onSkipPick(projectModel)
    setIsTooltipOpen(false) // Close the tooltip after action
  }

  const handleComplete = (projectModel: any) => {
    onCompletePick(projectModel)
    setIsTooltipOpen(false) // Close the tooltip after action
  }

  const handleEdit = (projectModel: any) => {
    onSelectPick(projectModel)
    setIsTooltipOpen(false) // Close the tooltip after action
  }

  if (
    !hasPickWriteAccess(
      currentProject?.permission,
      projectModel?.ProjectModelAccess?.[0]?.permission
    )
  )
    return null

  return (
    <>
      <ConfirmationDialog
        title='Skip Project Model'
        message='Are you sure you want to skip this pick?'
        open={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={() => handleSkip(projectModel)}
      />
      <ConfirmationDialog
        showCancelButton={false}
        title='Save or Complete Project Model'
        message='Save or complete this project model?'
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        confirmButtonText='Mark as Completed'
        onConfirm={() => handleComplete(projectModel)}
        showChildren={showChildren}
      >
        <Button className='bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition'>
          Save Annotations
        </Button>
      </ConfirmationDialog>
      <TooltipProvider delayDuration={0}>
        {' '}
        {/* Speed up the tooltip opening */}
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
          {' '}
          {/* Controlled open state */}
          <TooltipTrigger asChild>
            {/* Ellipsis button to trigger the tooltip on both hover and click */}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsTooltipOpen(!isTooltipOpen)}
            >
              <EllipsisVertical />
            </Button>
          </TooltipTrigger>
          {/* Tooltip Content containing action buttons */}
          <TooltipContent
            sideOffset={4}
            className='max-w-md p-2 bg-white shadow-md rounded-lg border border-gray-200 animate-in fade-in-0'
          >
            <div className='flex flex-col gap-2'>
              <Button
                className='flex items-center justify-center gap-2 bg-green-700 text-white w-full py-2 rounded-lg hover:bg-green-600 transition'
                onClick={handleShowCompleteModal}
              >
                <Check size={18} />
                Complete
              </Button>

              <Button
                className='flex items-center justify-center gap-2 bg-red-700 text-white w-full py-2 rounded-lg hover:bg-red-600 transition'
                onClick={handleShowSkipModal}
              >
                <Ban size={18} />
                Skip
              </Button>

              <Button
                className='flex items-center justify-center gap-2 bg-gray-700 text-white w-full py-2 rounded-lg hover:bg-gray-600 transition'
                onClick={() => handleEdit(projectModel)}
              >
                <Pencil size={18} />
                Edit
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default ActionButtons
