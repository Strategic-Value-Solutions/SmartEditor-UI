// @ts-nocheck
import { Card } from '@/components/ui/card'
import StatusCapsule from '@/components/ui/status-capsule'
import { formatText, getStatusDotColor, getStatusStyles } from '@/utils'
import { File, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ project, handleClick, onEdit, onConfirm }: any) => {
  const navigate = useNavigate()
  const { name } = project

  return (
    <Card className='m-2 w-52 capitalize'>
      <div className='flex flex-col rounded-lg bg-white p-4'>
        <div
          className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-pink-300 cursor-pointer'
          onClick={() => handleClick(project)}
        >
          <File className='text-9xl text-white' size={50} />
        </div>
        <div className='flex flex-col pt-4'>
          <h4 className='text-lg font-semibold'>{name}</h4>
          <div className='mt-4 flex items-center justify-between'>
            {/* <span
              className={`text-sm flex items-center justify-center p-1 rounded-full ${getStatusStyles(
                project.status
              )}`}
              style={{ height: '24px', padding: '0 8px' }}
            >
              {formatText(project.status)}
              <span
                className={`ml-2 w-2 h-2 rounded-full ${getStatusDotColor(
                  project.status
                )}`}
              ></span>
            </span> */}
            <StatusCapsule
              status={project.status}
              redirectTo={() => handleClick(project)}
            />
            <div className='flex items-center gap-2'>
              <button
                onClick={() => onEdit(project)}
                className='h-6 w-6 flex items-center justify-center rounded p-1 hover:bg-gray-200'
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onConfirm(project)}
                className='h-6 w-6 flex items-center justify-center rounded bg-red-400 p-1 text-white hover:bg-red-500'
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard
