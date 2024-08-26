import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import { setProjectModels } from '@/store/slices/projectModelSlice'
import { getErrorMessage } from '@/utils'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

function EditProjectModelModal({
  showPickModal,
  setShowPickModal,
  selectedPick,
  setSelectedPick,
  projectId,
}: any) {
  const [loading, setLoading] = useState(false)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0]
      setSelectedPick((prevState: any) => ({
        ...prevState,
        file,
        fileUrl: URL.createObjectURL(file),
      }))
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })
  const dispatch = useDispatch()
  const { projectModels } = useSelector(
    (state: RootState) => state.projectModels
  )
  const handleUploadFile = async () => {
    if (!selectedPick?.file) return toast.error('Please select a file')
    try {
      setLoading(true)
      const response = await projectApi.uploadProjectModelPdf(
        projectId,
        selectedPick.id,
        selectedPick.file
      )
      setSelectedPick(null)
      const updatedModels = projectModels.map((projectModel: any) =>
        projectModel.id === selectedPick.id
          ? { ...response, isActive: selectedPick.isActive }
          : projectModel
      )
      dispatch(setProjectModels(updatedModels))
      setShowPickModal(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={showPickModal}
      onOpenChange={loading ? undefined : setShowPickModal}
    >
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Pick</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div
            className='flex h-full w-full items-center justify-center py-8'
            {...getRootProps()}
          >
            <div className='flex h-[10vh] w-full max-w-[40vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
              {selectedPick?.file ? (
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>
                    {selectedPick?.file?.name}
                  </span>
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
        </DialogDescription>
        <DialogFooter className='flex justify-center items-center gap-2 w-full'>
          <Button
            onClick={() => setShowPickModal(false)}
            className='mt-2 h-8 px-4 flex items-center justify-center bg-red-500'
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUploadFile}
            className='mt-2 h-8 px-4 flex items-center justify-center'
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Proceed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectModelModal
