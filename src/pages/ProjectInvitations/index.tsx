import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import projectAccessApi from '@/service/projectAccessApi'
import userApi from '@/service/userApi'
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
    case 'Cancelled' || 'Declined':
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
  const [search, setSearch] = useState('')
  const [invitations, setInvitations] = useState([])
  const [cancelInvitationLoading, setCancelInvitationLoading] = useState(false)
  const [openInviteCollaboratorModal, setOpenInviteCollaboratorModal] =
    useState(false)
  const [invitationAcceptLoading, setInvitationAcceptLoading] = useState(false)
  const [invitationDeclineLoading, setInvitationDeclineLoading] =
    useState(false)

  const getInvitations = async () => {
    try {
      const response = await userApi.getInvitations()
      setInvitations(response)
    } catch (error) {
      console.error('Error getting invitations:', error)
    }
  }

  useEffect(() => {
    getInvitations()
  }, [])

  const acceptInvitation = async (invitation: any) => {
    const query = `?token=${invitation?.token}`
    setInvitationAcceptLoading(true)
    try {
      await projectAccessApi.acceptProjectInvitation(
        invitation?.projectId,
        query
      )
      toast.success('Invitation accepted')
      getInvitations()
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast.error('Failed to accept invitation')
    }
    setInvitationAcceptLoading(false)
  }

  const declineInvitation = async (invitation: any) => {
    setInvitationDeclineLoading(true)
    try {
      // Implement the decline invitation logic here
      // await userApi.declineInvitation(invitationId)
      toast.success('Invitation declined')
      getInvitations()
    } catch (error) {
      console.error('Error declining invitation:', error)
      toast.error('Failed to decline invitation')
    }
    setInvitationDeclineLoading(false)
  }

  return (
    <div className='text-xl'>
      <div>Project Invitations</div>

      <div className='flex flex-col gap-4 border-2 border-gray-200 rounded-lg p-4 mt-4 min-h-[80vh] h-full'>
        {invitations.map((invitation: any) => (
          <div
            key={invitation?.id}
            className='flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-2'
          >
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 sm:mb-0'>
              <div className='flex items-center gap-4 mb-2 sm:mb-0'>
                <img
                  src={invitation?.project?.createdBy?.avatar}
                  alt={invitation?.project?.createdBy?.name}
                  className='w-10 h-10 rounded-full'
                />
                <div className='flex flex-col'>
                  <span className='text-lg text-gray-800 dark:text-gray-200'>
                    {invitation?.project?.createdBy?.name} invited you to join{' '}
                    {invitation?.project?.name}
                  </span>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {invitation?.email} •{' '}
                    {invitation?.role?.charAt(0).toUpperCase() +
                      invitation?.role?.slice(1).toLowerCase()}{' '}
                    • Expires{' '}
                    {new Date(invitation?.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {invitation?.status !== 'Pending' &&
                new Date(invitation?.expiresAt) <= new Date() && (
                  <div
                    className={`text-sm font-medium px-3 py-1 rounded-full ${getInvitationStatusColor(invitation?.status)}`}
                  >
                    {getInvitationStatusText(invitation?.status)}
                  </div>
                )}
            </div>
            <div className='flex space-x-3'>
              {new Date(invitation?.expiresAt) <= new Date() &&
              invitation?.status === 'Pending' ? (
                <div className='text-sm font-medium px-3 py-1 rounded-full bg-gray-200 text-gray-700'>
                  Expired
                </div>
              ) : invitation?.status === 'Pending' ? (
                <>
                  <Button
                    variant='default'
                    className='w-28'
                    title='Accept Invitation'
                    onClick={() => acceptInvitation(invitation)}
                    disabled={invitationAcceptLoading}
                  >
                    {invitationAcceptLoading ? (
                      <Loader2
                        size={24}
                        className='animate-spin text-primary'
                      />
                    ) : (
                      'Accept'
                    )}
                  </Button>
                  <Button
                    variant='destructive'
                    className='w-28'
                    title='Decline Invitation'
                    onClick={() => declineInvitation(invitation)}
                    disabled={invitationDeclineLoading}
                  >
                    {invitationDeclineLoading ? (
                      <Loader2
                        size={24}
                        className='animate-spin text-primary'
                      />
                    ) : (
                      'Decline'
                    )}
                  </Button>
                </>
              ) : (
                <div
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getInvitationStatusColor(
                    invitation?.status
                  )}`}
                >
                  {invitation?.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Invitations
