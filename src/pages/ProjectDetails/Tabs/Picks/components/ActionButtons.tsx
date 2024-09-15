import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  const [dialogOpen, setDialogOpen] = useState(false) // State to control dialog open/close
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

  // Handle closing the modal after actions
  const handleCloseDialog = () => {
    setDialogOpen(false)
    setShowSkipModal(false)
    setShowCompleteModal(false)
  }

  const handleSkip = (projectModel: any) => {
    onSkipPick(projectModel)
    handleCloseDialog() // Close the modal after skipping
  }

  const handleComplete = (projectModel: any) => {
    onCompletePick(projectModel)
    handleCloseDialog() // Close the modal after completing
  }

  const handleEdit = (projectModel: any) => {
    onSelectPick(projectModel)
    handleCloseDialog() // Close the modal after editing
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <EllipsisVertical />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-md p-6 rounded-lg shadow-lg'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold'>
              Project Model Actions
            </DialogTitle>
            <DialogDescription className='text-sm text-gray-600'>
              Choose an action to perform on this project model.
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col gap-4 mt-4'>
            <ConfirmationDialog
              title='Skip Project Model'
              message='Are you sure you want to skip this pick?'
              open={showSkipModal}
              onClose={() => setShowSkipModal(false)}
              onConfirm={() => handleSkip(projectModel)} // Close modal on skip
            />
            <ConfirmationDialog
              showCancelButton={false}
              title='Save or Complete Project Model'
              message='Save or complete this project model?'
              open={showCompleteModal}
              onClose={() => setShowCompleteModal(false)}
              confirmButtonText='Mark as Completed'
              onConfirm={() => handleComplete(projectModel)} // Close modal on complete
              showChildren={showChildren}
            >
              <Button className='bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition'>
                Save Annotations
              </Button>
            </ConfirmationDialog>

            <div className='flex gap-2'>
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
                onClick={() => handleEdit(projectModel)} // Close modal on edit
              >
                <Pencil size={18} />
                Edit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionButtons
