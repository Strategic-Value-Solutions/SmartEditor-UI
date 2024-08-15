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

const DeleteTemplate = ({ open,onClose, onConfirm, trigger ,title,message}: any) => {
  return (
    <Dialog open={open}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            {message}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm} color='destructive' className='bg-red-500'>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTemplate
