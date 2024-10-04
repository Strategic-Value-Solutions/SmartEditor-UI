// @ts-nocheck
import { File } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ModelConfigurationCard = ({
  project,
  handleRedirectToProjectModelScreen,
  onEdit,
  onConfirm,
}: any) => {
  const navigate = useNavigate()
  const { name } = project

  return (
    <div className='rounded-lg border bg-card text-card-foreground shadow-sm w-48 capitalize'>
      <div className='flex flex-col rounded-lg bg-white dark:bg-gray-700 p-2'>
        <div
          className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-blue-200 cursor-pointer'
          onClick={() => handleRedirectToProjectModelScreen(project)}
        >
          <File className='text-9xl text-white' size={50} />
        </div>
        <div className='flex flex-col pt-2'>
          <p className='text-sm'>{name}</p>
        </div>
      </div>
    </div>
  )
}

export default ModelConfigurationCard
