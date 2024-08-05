import { File } from 'lucide-react'

const ProjectCard = ({ title }: any) => {
  return (
    <div className='flex h-48 w-48 cursor-pointer flex-col rounded-lg bg-white p-4'>
      <div className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-[#fbe3f0]'>
        <File className='text-9xl text-white' size={50} />
      </div>
      <div className='flex-grow px-2 pt-2 text-left font-light'>{title}</div>
    </div>
  )
}

export default ProjectCard
