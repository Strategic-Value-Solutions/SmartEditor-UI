import { Input } from '../ui/input'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import {
  navigateToPick,
  setProjectModels,
} from '@/store/slices/projectModelSlice'
import { updateCurrentProjectDetails } from '@/store/slices/projectSlice'
import { getErrorMessage } from '@/utils'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

interface UploadModalProps {
  projectId: string
  currentProjectModel: any
  projectModels: any[]
}

function SelectPick({
  projectId,
  currentProjectModel,
  projectModels,
}: UploadModalProps) {
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )

  const dispatch = useDispatch()
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  // Initialize local state to track selected field values
  const [fieldValues, setFieldValues] = useState(
    currentProject?.config?.attributes.map((field: any) => ({
      name: field.name,
      selectedValue: field?.values?.[0]?.fieldValue || '', // Set initial value if available
    }))
  )

  // Handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0]
      setSelectedFile(file)
    },
    accept: {
      'application/pdf': ['.pdf'],
      // 'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  // Handle select value change
  const handleFieldValueChange = (index: number, newValue: string) => {
    const updatedFieldValues = [...fieldValues]
    updatedFieldValues[index].selectedValue = newValue
    setFieldValues(updatedFieldValues)

    dispatch(
      updateCurrentProjectDetails({
        activePick: newValue,
      })
    )
  }

  const handleUploadFile = async () => {
    if (!selectedFile) return toast.error('Please select a file')
    try {
      setLoading(true)
      const response = await projectApi.uploadProjectModelPdf(
        projectId,
        currentProjectModel.id,
        selectedFile
      )
      setSelectedFile(response?.fileUrl)
      const updatedModels = projectModels.map((projectModel: any) =>
        projectModel.id === currentProjectModel.id ? response : projectModel
      )

      dispatch(setProjectModels(updatedModels))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col w-full max-w-[500px] border rounded-md items-center justify-center p-4'>
      <div
        className='flex h-full w-full items-center justify-center py-8'
        {...getRootProps()}
      >
        <div className='flex h-[10vh] w-full max-w-[40vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
          {selectedFile ? (
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>{selectedFile.name}</span>
            </p>
          ) : (
            <>
              <div className='space-y-1 text-center'>
                <div className={`text-md flex text-gray-600`}>
                  <label className='relative cursor-pointer rounded-md bg-transparent font-medium text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:text-indigo-500'>
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
            </>
          )}
        </div>
      </div>

      <div className='w-full flex justify-center items-center'>
        <Button
          onClick={handleUploadFile}
          className='mt-2 flex h-8 w-fit items-center justify-center'
        >
          Proceed
        </Button>
      </div>
    </div>
  )
}

export default SelectPick
