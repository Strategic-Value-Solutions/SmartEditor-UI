import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const DeleteTemplate = ({ trigger, onDelete, onClose }: any) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Template</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this template?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onDelete} color='destructive' className='bg-red-500'>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTemplate
