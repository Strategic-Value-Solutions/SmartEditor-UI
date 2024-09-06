import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import projectAccessApi from '@/service/projectAccessApi'
import { Loader2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const getInvitationStatusColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'Accepted':
      return 'text-green-500 dark:text-green-400'
    case 'Cancelled':
      return 'text-red-500 dark:text-red-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
}

const getInvitationStatusText = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'Pending'
    case 'Accepted':
      return 'Accepted'
    case 'Cancelled':
      return 'Cancelled'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }
}

const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const Invitations = () => {
  const { projectId } = useParams()

  const [search, setSearch] = useState('')
  const [invitations, setInvitations] = useState([])
  const [cancelInvitationLoading, setCancelInvitationLoading] = useState(false)
  const [openInviteCollaboratorModal, setOpenInviteCollaboratorModal] =
    useState(false)

  const getInvitations = async () => {
    if (!projectId) return

    try {
      const response = await projectAccessApi.getProjectInvitations(projectId)
      setInvitations(response)
    } catch (error) {
      console.error('Error getting invitations:', error)
    }
  }

  useEffect(() => {
    getInvitations()
  }, [projectId])

  const cancelInvitation = async (invitationId: string) => {
    if (!projectId) return

    setCancelInvitationLoading(true)
    try {
      await projectAccessApi.cancelProjectInvitation(projectId, invitationId)
      toast.success('Invitation canceled')
      getInvitations()
    } catch (error) {
      console.error('Error canceling invitation:', error)
    }
    setCancelInvitationLoading(false)
  }

  return (
    <div className='bg-white dark:bg-gray-800  rounded-lg'>
      <div className='bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-gray-600'>
        <div className='mb-4'>
          <Input
            type='text'
            placeholder='Find a collaborator...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600'
          />
        </div>

        {invitations.map((invitation: any) => (
          <div
            key={invitation?.id}
            className='flex flex-row items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg mb-2'
          >
            <div className='flex items-center justify-between w-full'>
              <div className='text-gray-700 dark:text-gray-300 w-1/3 flex items-center gap-2'>
                <div
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getRandomColor()}`}
                >
                  {invitation?.email?.charAt(0)?.toUpperCase()}
                </div>
                <span>{invitation?.email}</span>
              </div>
              <div className='text-gray-500 dark:text-gray-400 text-sm'>
                {invitation?.role?.charAt(0).toUpperCase() +
                  invitation?.role?.slice(1).toLowerCase()}
              </div>

              <div
                className={`text-sm ${getInvitationStatusColor(invitation?.status)}`}
              >
                {getInvitationStatusText(invitation?.status)}
              </div>
            </div>
            <Button
              variant='ghost'
              className='ml-4'
              title='Cancel Invitation'
              onClick={() => cancelInvitation(invitation?.id)}
              disabled={cancelInvitationLoading}
            >
              {cancelInvitationLoading ? (
                <Loader2 size={18} />
              ) : (
                <Trash2 size={18} />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Invitations
