import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDropzone } from 'react-dropzone'

interface UploadModalProps {
  pick: string
  setPick: any
  selectedFile: any
  setSelectedFile: any
  onSubmit: Function
}

function SelectPick({
  pick,
  setPick,
  selectedFile,
  setSelectedFile,
  onSubmit,
}: UploadModalProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0]
      setSelectedFile(file)
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  return (
    <div className='flex flex-col w-[500px] border rounded-md items-center justify-center p-4'>
      <Select value={pick} onValueChange={(value: any) => setPick(value)}>
        <SelectTrigger>
          <SelectValue placeholder='Supermodel Type' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='Master Structure'>Master Structure</SelectItem>
          <SelectItem value='Project Area'>Project Area</SelectItem>
          <SelectItem value='Inspection Area'>Inspection Area</SelectItem>
          <SelectItem value='Inspection Type'>Inspection Type</SelectItem>
          <SelectItem value='Component'>Component</SelectItem>
        </SelectContent>
      </Select>
      <div
        className='flex h-full w-full items-center justify-center py-8'
        {...getRootProps()}
      >
        <div className='flex h-[10vh] w-[40vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
          {selectedFile ? (
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>{selectedFile.name}</span>
            </p>
          ) : (
            <div className='space-y-1 text-center'>
              <div className={`text-md flex text-gray-600`}>
                <label className='relative cursor-pointer rounded-md bg-transparent font-medium text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500'>
                  <span>Upload a file</span>
                </label>
                <input
                  type='file'
                  className='sr-only'
                  accept='application/pdf,image/*'
                  {...getInputProps()}
                />
                <p className='pl-1'>or drag and drop</p>
              </div>
              <p className='text-sm'>PDF or Image</p>
            </div>
          )}
        </div>
      </div>

      <div className='w-full flex justify-center items-center'>
        <Button
          onClick={() => onSubmit()}
          className='mt-2 flex h-8 w-fit items-center justify-center'
        >
          Proceed
        </Button>
      </div>
    </div>
  )
}

export default SelectPick
