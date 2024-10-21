//@ts-nocheck
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { FileInput } from '../ui/file-upload'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useEditor } from './CanvasContext/CanvasContext'
import GenerateReportModal from './components/GenerateReportModal'
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
import { cn } from '@/lib/utils'
import annotationApi from '@/service/annotationApi'
import eventTriggerApi from '@/service/eventTriggerApi'
import projectApi from '@/service/projectApi'
import { ReloadIcon } from '@radix-ui/react-icons'
import { addDays, format } from 'date-fns'
import {
  CalendarIcon,
  CheckCircleIcon,
  List,
  Loader2,
  Webhook,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const AnnotationModal = ({ children }) => {
  const { projectId } = useParams()
  const editor = useEditor()
  const { user } = useSelector((state: RootState) => state.auth)
  const templatesData = useSelector(
    (state: RootState) => state.template.templatesData || []
  )
  const [status, setStatus] = useState(
    editor?.selectedAnnotation?.status || 'Pending'
  )
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false)
  const [postDataType, setPostDataType] = useState('send-mail')
  const [postDataUrl, setPostDataUrl] = useState('')
  const [showInformation, setShowInformation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [eventTriggered, setEventTriggered] = useState(false)
  const [eventTriggers, setEventTriggers] = useState([])
  const [isReloadingEventTriggers, setIsReloadingEventTriggers] =
    useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [file, setFile] = useState(null)
  const [projectSettings, setProjectSettings] = useState(null)
  const [predefinedChecklists, setPredefinedChecklists] = useState([])
  const [annotationChecklist, setAnnotationChecklist] = useState([])
  const [timelineEstimation, setTimelineEstimation] = useState({
    estimatedStartDate: null,
    estimatedEndDate: null,
  })

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

  const updateEstimatedTimeline = () => {
    if (
      !timelineEstimation.estimatedStartDate ||
      !timelineEstimation.estimatedEndDate
    ) {
      toast.error('Please enter a valid timeline')
      return
    }

    if (editor.selectedAnnotation?.id) {
      editor.updateAnnotation(editor.selectedAnnotation.id, {
        estimatedStartDate: timelineEstimation.estimatedStartDate,
        estimatedEndDate: timelineEstimation.estimatedEndDate,
      })

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
      setTimeout(() => {
        setEventTriggered(false)
      }, 3000)
      toast.success('Event triggered successfully')
    } catch (error) {
      console.error('Failed to create event trigger:', error)
    }
    setIsLoading(false)
  }

  const getProjectSettings = async () => {
    try {
      const response = await projectApi.getSettings(projectId)
      setProjectSettings(response)
    } catch (error) {
      console.error('Failed to get project settings:', error)
    }
  }
  const getPredefinedChecklists = async () => {
    try {
      const response = await annotationApi.getPredefinedChecklists()
      setPredefinedChecklists(response)
    } catch (error) {
      console.error('Failed to get predefined checklists:', error)
    }
  }

  const createAnnotationChecklist = async ({
    id,
    name,
    description,
    isCompleted,
  }) => {
    try {
      const response = await annotationApi.createProjectChecklist(projectId, {
        id,
        name,
        description,
        isCompleted,
        annotationId: editor?.selectedAnnotation?.id,
      })
      getAnnotationChecklist()
    } catch (error) {
      console.error('Failed to create annotation checklist:', error)
    }
  }

  const getAnnotationChecklist = async () => {
    const query = `?annotationId=${editor?.selectedAnnotation?.id}`
    try {
      const response = await annotationApi.getProjectChecklist(projectId, query)
      setAnnotationChecklist(response)
    } catch (error) {
      console.error('Failed to get annotation checklist:', error)
    }
  }

  useEffect(() => {
    getProjectSettings()
  }, [])

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
      getPredefinedChecklists()
      getAnnotationChecklist()
    }
  }, [editor.selectedAnnotation])

  const handleShowReportGenerationModal = () => {
    if (!selectedTemplate.id) {
      toast.error('Please select a template to generate report')
      return
    }
    setShowGenerateReportModal(true)
    editor.setShowAnnotationModal(false)
  }

  const handleCloseGenerateReportModal = () => {
    setShowGenerateReportModal(false)
    editor.setShowAnnotationModal(true)
    setSelectedTemplate(null)
  }

  useEffect(() => {
    const alteredPredefinedChecklists = predefinedChecklists?.filter(
      (checklist) =>
        !annotationChecklist.some(
          (item) => item.description === checklist.description
        )
    )
    setPredefinedChecklists(alteredPredefinedChecklists)
  }, [annotationChecklist])

  const checklistCompleted =
    predefinedChecklists.length === 0 &&
    !annotationChecklist.some((checklist) => checklist.completedAt === null)

  return (
    <div>
      {/* The Dialog component */}
      <GenerateReportModal
        showGenerateReportModal={showGenerateReportModal}
        handleCloseGenerateReportModal={handleCloseGenerateReportModal}
        template={selectedTemplate}
        customImage={file}
      />

      <Dialog
        open={editor.showAnnotationModal}
        onOpenChange={editor.setShowAnnotationModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annotation Details</DialogTitle>
            {/* <DialogDescription>
              You can change the status of the selected annotation here.
            </DialogDescription> */}
          </DialogHeader>
          <div className='flex flex-col justify-center border p-2 rounded-md shadow-md'>
            <p className='py-2 text-md font-semibold flex items-center gap-2'>
              <CalendarIcon className='h-4 w-4' />
              Estimated Timeline
            </p>
            <p className='text-sm text-gray-400'>
              This estimation helps to analyze the overall project timeline. If
              it is not given then this component wont be added in the project
              timeline till it is started
            </p>
            <div className='flex justify-center items-center gap-2 w-full mt-2'>
              <input
                type='date'
                value={format(
                  timelineEstimation.estimatedStartDate,
                  'yyyy-MM-dd'
                )}
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) =>
                  setTimelineEstimation({
                    ...timelineEstimation,
                    estimatedStartDate: new Date(e.target.value),
                  })
                }
                min={format(new Date(), 'yyyy-MM-dd')}
                className='border p-2 rounded-md w-1/2'
              />
              <input
                type='date'
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                value={format(
                  timelineEstimation.estimatedEndDate,
                  'yyyy-MM-dd'
                )}
                onChange={(e) =>
                  setTimelineEstimation({
                    ...timelineEstimation,
                    estimatedEndDate: new Date(e.target.value),
                  })
                }
                min={format(new Date(), 'yyyy-MM-dd')}
                className='border p-2 rounded-md w-1/2'
              />
              <Button onClick={updateEstimatedTimeline} className='p-2'>
                Set
              </Button>
            </div>
          </div>
          {/* Dropdown for Changing Status */}
          <div className='flex flex-col justify-center border p-2 rounded-md shadow-md'>
            <div className='flex flex-col gap-4'>
              <p className='text-md font-semibold flex items-center gap-2'>
                <List className='h-4 w-4' /> Inspection Checklist
              </p>
              {annotationChecklist.map((checklist) => (
                <div key={checklist.id} className='flex items-center gap-2'>
                  <div
                    className={`h-5 w-5 flex justify-start items-center cursor-pointer text-blue-600 transition duration-150 ease-in-out ${checklist.completedAt ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() =>
                      createAnnotationChecklist({
                        ...checklist,
                        isCompleted: !checklist.completedAt,
                      })
                    }
                  >
                    {checklist.completedAt ? (
                      <CheckCircleIcon />
                    ) : (
                      <CheckCircleIcon className='text-gray-400' />
                    )}
                  </div>
                  <label
                    htmlFor={checklist.id}
                    className='ml-3 block text-sm text-gray-700'
                  >
                    {checklist.name}
                  </label>
                </div>
              ))}
              {predefinedChecklists.map((checklist) => (
                <div key={checklist.id} className='flex items-center gap-2'>
                  <div
                    className={`h-5 w-5 flex justify-start items-center cursor-pointer text-blue-600 transition duration-150 ease-in-out ${checklist.completedAt ? 'text-green-500' : 'text-gray-400'}`}
                    onClick={() =>
                      createAnnotationChecklist({
                        ...checklist,
                        isCompleted: !checklist.completedAt,
                      })
                    }
                  >
                    {checklist.completedAt ? (
                      <CheckCircleIcon />
                    ) : (
                      <CheckCircleIcon className='text-gray-400' />
                    )}
                  </div>
                  <label
                    htmlFor={checklist.id}
                    className='ml-3 block text-sm text-gray-700'
                  >
                    {checklist.name}
                  </label>
                </div>
              ))}
            </div>
            <p className='text-sm text-gray-400 mt-3'>
              {!checklistCompleted
                ? 'You need to completed all the checklist to mark the annotation as completed.'
                : 'All checklists are completed. You can change the status of the annotation to completed.'}
            </p>
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
                {checklistCompleted && (
                  <SelectItem value='Completed'>Completed</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {projectSettings?.enableEventTrigger ? (
            <>
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
                      You can trigger another event in next 3 seconds. For
                      failed events, we will retry continuously until
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
                          {projectSettings?.enableEmailTrigger && (
                            <SelectItem value='send-mail'>Send Mail</SelectItem>
                          )}

                          {projectSettings?.enablePublishDataTrigger && (
                            <SelectItem value='post-data'>
                              Publish Data
                            </SelectItem>
                          )}

                          {projectSettings?.enableReportGenerationTrigger && (
                            <SelectItem value='generate-report'>
                              Generate Report
                            </SelectItem>
                          )}
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

                    {postDataType === 'generate-report' && (
                      <div className='mt-4 text-sm text-gray-400 text-center'>
                        <Select
                          className='w-full '
                          onValueChange={(value) => setSelectedTemplate(value)}
                          value={selectedTemplate?.name}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a template' />
                          </SelectTrigger>
                          <SelectContent>
                            {templatesData.map((template) => (
                              <SelectItem key={template.id} value={template}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className='mt-2 flex h-8 w-fit items-center justify-center'
                          onClick={handleShowReportGenerationModal}
                        >
                          Generate Report
                        </Button>
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
                            {new Date(trigger.createdAt).toLocaleDateString()}{' '}
                            with status {trigger.status}
                            {trigger.url ? ` to ${trigger.url}` : ''}
                            {trigger.fileUrl ? ` with attachment` : ''}.
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className='text-sm text-gray-400 text-center'>
              Trigger disabled. You can change trigger options from project
              settings
            </div>
          )}

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
