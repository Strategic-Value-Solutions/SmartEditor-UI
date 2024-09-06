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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import projectAccessApi from '@/service/projectAccessApi'
// assuming the dialog components are exported from this file
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const AddCollaboratorDialog = ({
  openInviteCollaboratorModal,
  handleInviteCollaboratorModal,
}: {
  openInviteCollaboratorModal: boolean
  handleInviteCollaboratorModal: () => void
}) => {
  const { projectId } = useParams()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvite = async () => {
    if (!projectId || !email || !role) return

    setLoading(true)
    try {
      await projectAccessApi.sendProjectInvitation(projectId, { email, role })
      toast.success('Collaborator invited')
      handleInviteCollaboratorModal()
      setEmail('')
      setRole('')
    } catch (error) {
      console.error('Error inviting collaborator:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={openInviteCollaboratorModal}
      onOpenChange={handleInviteCollaboratorModal}
    >
      <DialogTrigger asChild>
        <Button className='flex h-8 items-center justify-center gap-2 p-2'>
          Add people
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-white p-6 rounded-lg shadow-md max-w-md w-full'>
        <DialogHeader className='text-center'>
          <UserPlus className='mx-auto mb-2' size={24} />
          <DialogTitle className='text-lg font-semibold'>
            Invite a collaborator
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <Input
            type='text'
            placeholder='Enter email'
            className='w-full bg-white text-gray-800 py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='mt-4'>
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder='Select a role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='OWNER'>OWNER</SelectItem>
              <SelectItem value='EDITOR'>EDITOR</SelectItem>
              <SelectItem value='VIEWER'>VIEWER</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className='mt-4'>
          <Button
            className='flex h-8 w-full items-center justify-center gap-2 p-2'
            onClick={handleInvite}
            disabled={loading}
          >
            {loading ? 'Inviting...' : 'Invite'}
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
