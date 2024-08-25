// @ts-nocheck
import { Card } from '@/components/ui/card'
import { File, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ project, handleClick, onEdit, onConfirm }: any) => {
  const navigate = useNavigate()
  const { name } = project

  return (
    <Card className='m-2 w-52 capitalize'>
      <div className='flex  cursor-pointer flex-col rounded-lg bg-white p-4'>
        <div
          className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-pink-300'
          onClick={() => handleClick(project)}
        >
          <File className='text-9xl text-white' size={50} />
        </div>
        <div className='flex justify-between pt-2'>
          <div className='flex-grow text-left font-light'>{name}</div>
          <div className='flex justify-between gap-1'>
            <button onClick={() => onEdit(project)} className='h-6 rounded p-1'>
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onConfirm(project)}
              className='h-6 rounded bg-red-400 p-1 text-white'
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProjectCard
