import Loader from '@/components/ui/Loader'
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
import { getErrorMessage } from '@/utils'
import { File, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Document, Page } from 'react-pdf'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function EditPickModal({
  showPickModal,
  setShowPickModal,
  selectedPick,
  setSelectedPick,
  projectId,
  setProjectModels,
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
  const handleUploadFile = async () => {
    if (!selectedPick?.file) return toast.error('Please select a file')
    try {
      setLoading(true)
      const response = await projectApi.uploadProjectModelPdf(
        projectId,
        selectedPick.id,
        selectedPick
      )
      setSelectedPick(null)
      setProjectModels((prevState: any) =>
        prevState.map((projectModel: any) =>
          projectModel.id === selectedPick.id ? response : projectModel
        )
      )
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

const Picks = () => {
  const { projectId } = useParams()
  const [projectModels, setProjectModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPickModal, setShowPickModal] = useState(false)
  const [selectedPick, setSelectedPick] = useState<any>(null)

  useEffect(() => {
    const fetchProjectModels = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjectModels(projectId)

        setProjectModels(response)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchProjectModels()
  }, [projectId])

  const handleSelectPick = (pick: any) => {
    setSelectedPick(pick)
    setShowPickModal(true)
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Picks</h3>
      <EditPickModal
        showPickModal={showPickModal}
        setShowPickModal={setShowPickModal}
        selectedPick={selectedPick}
        setSelectedPick={setSelectedPick}
        projectId={projectId}
        setProjectModels={setProjectModels}
      />

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {projectModels.map((projectModel: any, index: any) => (
          <div key={projectModel.id || index} className='border rounded-lg p-4'>
            <div className='flex justify-center items-center h-40 bg-gray-100'>
              {projectModel.fileUrl ? (
                <div className='text-center w-full flex justify-center items-center flex-col'>
                  <div className='mb-2 text-gray-500 flex justify-center w-full items-center'>
                    <File size={100} />
                  </div>
                </div>
              ) : (
                <div className='text-center w-full flex justify-center items-center flex-col'>
                  <div className='mb-2 text-gray-500 flex justify-center w-full items-center'>
                    No file available
                  </div>
                  <div className='h-20 w-20 bg-gray-300 rounded flex items-center justify-center'>
                    <span className='text-gray-400 text-sm'>No PDF</span>
                  </div>
                </div>
              )}
            </div>
            <h4 className='mt-2 text-lg'>{projectModel?.pickModel?.name}</h4>
            <div className='mt-2 flex items-center justify-end gap-2'>
              <button
                className='h-6 rounded p-1'
                onClick={() => handleSelectPick(projectModel)}
              >
                <Pencil size={15} />
              </button>
              <button className='h-6 rounded bg-red-400 p-1'>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Picks
