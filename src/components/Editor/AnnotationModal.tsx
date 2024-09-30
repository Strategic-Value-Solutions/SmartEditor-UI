//@ts-nocheck
import { Button } from '../ui/button'
import { FileInput } from '../ui/file-upload'
import { Input } from '../ui/input'
import { useEditor } from './CanvasContext/CanvasContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import eventTriggerApi from '@/service/eventTriggerApi'
import { ReloadIcon } from '@radix-ui/react-icons'
import { CheckCircleIcon, Loader2, Webhook } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const AnnotationModal = ({ children }) => {
  const editor = useEditor()
  const { user } = useSelector((state: RootState) => state.auth)

  const [status, setStatus] = useState(
    editor?.selectedAnnotation?.status || 'Pending'
  )
  const [postDataType, setPostDataType] = useState('send-mail')
  const [postDataUrl, setPostDataUrl] = useState('')
  const [showInformation, setShowInformation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [eventTriggered, setEventTriggered] = useState(false)
  const [eventTriggers, setEventTriggers] = useState([])
  const [isReloadingEventTriggers, setIsReloadingEventTriggers] =
    useState(false)
  const [file, setFile] = useState(null)

  // Handle file drop
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0]
      setFile(file)
    },
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  // Debugging log
  // Function to handle status change, update annotation color, and close the modal
  const handleStatusChange = (newStatus) => {
    // Debugging log
    setStatus(newStatus)

    // Update the status of the selected annotation
    if (editor.selectedAnnotation?.id) {
      editor.changeAnnotationStatusById(
        editor.selectedAnnotation.id,
        newStatus,
        editor.currPage
      )

      // Close the modal after status is changed
      // editor.setShowAnnotationModal(false)
    } else {
      console.error('No annotation selected or invalid editor state')
    }
  }

  const handlePostDataTypeChange = (newPostDataType) => {
    setPostDataType(newPostDataType)
  }

  const handleSubmitPostData = async () => {
    const formData = new FormData()
    formData.append('annotationId', editor.selectedAnnotation.id)
    formData.append('url', postDataUrl)
    formData.append('data', JSON.stringify(editor.selectedAnnotation))
    formData.append('postDataType', postDataType)

    if (file) {
      formData.append('file', file)
    }

    if (!postDataType) {
      toast.error('Please select an action')
      return
    }

    setIsLoading(true)

    try {
      await eventTriggerApi.createEventTrigger(formData)
      setEventTriggered(true)
      getEventTriggersForAnnotation()
      toast.success('Event triggered successfully')
    } catch (error) {
      console.error('Failed to create event trigger:', error)
    }
    setIsLoading(false)
  }

  const getEventTriggersForAnnotation = async () => {
    setIsReloadingEventTriggers(true)
    const annotationId = editor.selectedAnnotation.id
    try {
      const response = await eventTriggerApi.getEventTriggers(
        `annotationId=${annotationId}`
      )
      setEventTriggers(response)
    } catch (error) {
      console.error('Failed to get event trigger status:', error)
    }
    setIsReloadingEventTriggers(false)
  }

  const clearStates = () => {
    setPostDataType('')
    setPostDataUrl('')
    setShowInformation(false)
    setEventTriggered(false)
    setEventTriggers([])
    setIsReloadingEventTriggers(false)
    setFile(null)
  }

  useEffect(() => {
    clearStates()
    // Debugging log
    setStatus(editor?.selectedAnnotation?.status || 'new')
    if (editor.selectedAnnotation) {
      getEventTriggersForAnnotation()
    }
  }, [editor.selectedAnnotation])

  return (
    <div>
      {/* The Dialog component */}
      <Dialog
        open={editor.showAnnotationModal}
        onOpenChange={editor.setShowAnnotationModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Annotation Status</DialogTitle>
            <DialogDescription>
              You can change the status of the selected annotation here.
            </DialogDescription>
          </DialogHeader>

          {/* Dropdown for Changing Status */}
          <div className='flex flex-col justify-center border p-2 rounded-md shadow-md'>
            <div className='text-sm font-semibold flex justify-between items-center gap-2 py-2'>
              <p>Status</p>
              <p className='font-normal'>{status}</p>
            </div>

            <Select
              value={status}
              onValueChange={handleStatusChange}
              className='w-full mt-2'
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Pending'>Pending</SelectItem>
                <SelectItem value='Working'>Working</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col justify-center border p-2 rounded-md shadow-md'>
            <p className='text-md font-semibold flex items-center gap-2'>
              <Webhook className='h-4 w-4' /> Trigger Actions
            </p>
            {eventTriggered ? (
              <div className='flex flex-col items-center justify-center'>
                <div className='text-sm text-green-500 text-center flex flex-col items-center justify-center'>
                  <CheckCircleIcon className='h-12 w-12 my-3' />
                  Event triggered
                </div>

                <div className='text-sm text-gray-500 text-center mt-3'>
                  For failed events, we will retry continuously until
                  information is successfully sent.
                </div>
              </div>
            ) : (
              <>
                <div className='flex flex-col gap-2 mt-3'>
                  <Select
                    className='w-full mt-3'
                    value={postDataType}
                    onValueChange={handlePostDataTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select an action' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='send-mail'>Send Mail</SelectItem>
                      <SelectItem value='post-data'>Post Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {postDataType === 'post-data' && (
                  <>
                    <div className='mt-4'>
                      <p className='text-sm font-medium'>Post Data URL:</p>
                      <Input
                        type='text'
                        placeholder='Enter URL'
                        value={postDataUrl}
                        onChange={(e) => setPostDataUrl(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-gray-500 sm:text-sm'
                      />
                    </div>
                  </>
                )}

                {postDataType === 'send-mail' && (
                  <div className='mt-4 text-sm text-gray-400 text-center'>
                    Mail will be sent to {user.email}
                  </div>
                )}

                <div className='flex flex-col gap-2 mt-3 w-full'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium'>Show Information</p>
                    <Button
                      onClick={() => setShowInformation(!showInformation)}
                      size='small'
                      className='p-1'
                    >
                      {showInformation ? 'Hide' : 'Show'}
                    </Button>
                  </div>

                  {showInformation && (
                    <div className='flex items-center gap-2 w-full'>
                      <textarea
                        value={JSON.stringify(
                          editor?.selectedAnnotation,
                          null,
                          2
                        )}
                        disabled
                        className='w-full h-[20vh] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-gray-500 sm:text-sm'
                      />
                    </div>
                  )}
                </div>
                <div className='text-sm text-gray-400 text-center mt-3'>
                  <div
                    className='flex h-[12vh] w-full items-center justify-center py-8'
                    {...getRootProps()}
                  >
                    <div className='flex h-[10vh] w-full max-w-[40vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
                      {file ? (
                        <p className='text-sm text-gray-600'>
                          <span className='font-medium'>{file.name}</span>
                        </p>
                      ) : (
                        <>
                          <div className='flex flex-col  justify-center items-center space-y-1 text-center'>
                            <div
                              className={`text-md flex text-gray-600 text-center`}
                            >
                              <label className='relative text-center cursor-pointer rounded-md bg-transparent font-medium text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-500 focus-within:ring-offset-2 hover:text-indigo-500'>
                                <span>Upload a file</span>
                              </label>
                              <input
                                type='file'
                                className='sr-only'
                                accept='application/pdf,image/*'
                                {...getInputProps()}
                              />
                              <p className='pl-1'>or drag and drop  (optional)</p>
                            </div>
                            <p className='text-sm'>
                              File url will be sent in the request or mail
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSubmitPostData}
                  className='mt-4'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className='h-5 w-5 mr-2' />
                  ) : (
                    <CheckCircleIcon className='h-5 w-5 mr-2' />
                  )}
                  Submit
                </Button>
              </>
            )}
          </div>

          <div className='flex flex-col gap-2 mt-3 w-full'>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium'>Audits</p>
              <Button
                size='small'
                className='p-1'
                onClick={getEventTriggersForAnnotation}
              >
                {isReloadingEventTriggers ? (
                  <Loader2 className='h-4 w-4' />
                ) : (
                  <ReloadIcon className='h-4 w-4' />
                )}
              </Button>
            </div>
            <div className='flex flex-col justify-start items-center gap-2 mt-3 w-full min-h-[7vh] max-h-[20vh] overflow-y-auto pr-1'>
              {isReloadingEventTriggers ? (
                <div className='flex items-center justify-center'>
                  <Loader2 className='h-5 w-5 mr-2' />
                  Loading...
                </div>
              ) : (
                <>
                  {eventTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className='flex flex-col gap-1 p-2 rounded-md border border-gray-200 w-full'
                    >
                      <p className='text-sm text-gray-600'>
                        {trigger.name}, triggered at{' '}
                        {new Date(trigger.createdAt).toLocaleDateString()} with
                        status {trigger.status}
                        {trigger.url ? ` to ${trigger.url}` : ''}
                        {trigger.fileUrl ? ` with attachment` : ''}.
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Any additional content */}
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}

AnnotationModal.propTypes = {
  children: PropTypes.node,
}

export default AnnotationModal
