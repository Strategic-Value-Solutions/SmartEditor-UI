import AddCollaboratorDialog from './AddCollaboratorModal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'

const Collaborators = () => {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4'>
        <h2 className='text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-0'>
          Manage access
        </h2>
        <AddCollaboratorDialog />
      </div>

      <div className='bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-gray-600'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4'>
          <div className='flex items-center mb-2 sm:mb-0'>
            <Checkbox className='h-4 w-4' />
            <span className='ml-2 text-gray-600 dark:text-gray-300'>
              Select all
            </span>
          </div>
          <div className='text-gray-600 dark:text-gray-300'>Type</div>
        </div>

        <div className='mb-4'>
          <Input
            type='text'
            placeholder='Find a collaborator...'
            className='w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600'
          />
        </div>

        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-600'>
          <div className='flex items-center mb-2 sm:mb-0'>
            <Checkbox className='h-4 w-4' />
            <img
              src='https://via.placeholder.com/40'
              alt='Collaborator'
              className='w-8 h-8 rounded-full ml-2'
            />
            <div className='ml-3'>
              <div className='text-blue-600 dark:text-blue-400'>DeepankRx</div>
              <div className='text-gray-500 dark:text-gray-400 text-sm'>
                Collaborator
              </div>
            </div>
          </div>
          <Button variant='ghost'>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Collaborators
