import { File } from 'lucide-react' // Make sure to import the appropriate icon from shadcn-icons

const ExtFileComponent = ({ filename, createdAt }: any) => {
  return (
    <div className='flex h-60 w-48 cursor-pointer flex-col rounded-lg bg-white p-4'>
      <div className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-gray-200'>
        <File className='text-9xl text-white' size={50}/>
      </div>
      <div className='flex-grow px-2 pt-2 text-left font-light'>{filename}</div>
    </div>
  )
}

export default ExtFileComponent
