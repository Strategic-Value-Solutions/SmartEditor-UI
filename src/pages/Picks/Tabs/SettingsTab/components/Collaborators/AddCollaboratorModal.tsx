import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
// assuming the dialog components are exported from this file
import { UserPlus } from 'lucide-react'

const AddCollaboratorDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex h-8 items-center justify-center gap-2 p-2'>
          Add people
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white p-6 rounded-lg shadow-md max-w-md w-full'>
        <DialogHeader className='text-center'>
          <UserPlus className='mx-auto mb-2' size={24} />
          <DialogTitle className='text-lg font-semibold'>
            Add a collaborator to bill-frontend
          </DialogTitle>
          <DialogDescription className='text-gray-600'>
            Search by username, full name, or email
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4'>
          <Input
            type='text'
            placeholder='Find people'
            className='w-full bg-white text-gray-800 py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <DialogFooter className='mt-4'>
          <Button className='flex h-8 w-full items-center justify-center gap-2 p-2'>
            Select a collaborator above
          </Button>
        </DialogFooter>
        <DialogClose className='absolute right-4 top-4'>
          <span className='sr-only'>Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default AddCollaboratorDialog
