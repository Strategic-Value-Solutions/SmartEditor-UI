import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { setProjectSettings } from '@/store/slices/annotationSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'
import { Paperclip } from 'lucide-react'

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className='mb-3 h-8 w-8 text-gray-500 dark:text-gray-400'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 20 16'
      >
        <path
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
        />
      </svg>
      <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
        <span className='font-semibold'>Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className='text-xs text-gray-500 dark:text-gray-400'>
        PNG, JPG or PDF
      </p>
    </>
  )
}

function UploadModal({
  uploadImageRef,
  uploadPdfRef,
  isOpen,
  setIsOpen,
  projectId,
  uploadImage,
  onFileChange,
}: any) {
  const dispatch = useDispatch()
  const projectSettings = useSelector(
    (state) => state?.annotations?.projectSettings[projectId]
  )
  const form = useForm({
    defaultValues: {
      pickNumber: projectSettings?.pickNumber || '',
      file: null,
    },
  })

  useEffect(() => {
    if (projectSettings) {
      form.setValue('pickNumber', projectSettings?.pickNumber)
    }
  }, [projectSettings, form.setValue])

  const onSubmit = () => {
    dispatch(
      setProjectSettings({
        projectId,
        settings: { pickNumber: form.getValues('pickNumber') },
      })
    )
    setIsOpen(false)
  }

  const handleUploadImage = (e: any) => {
    uploadImage(e)
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        setProjectSettings({
          projectId,
          settings: { imageFile: reader.result },
        })
      )
    }
    reader.readAsDataURL(file)
  }

  const handleUploadPdf = (file: any) => {
    console.log(file)
    onFileChange(file)
    // const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        setProjectSettings({
          projectId,
          settings: { pdfFile: reader.result },
        })
      )
    }
    reader.readAsDataURL(file)
  }

  if (projectSettings?.imageFile || projectSettings?.pdfFile) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File and Select Type</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='pickNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selections</FormLabel>
                    <FormControl>
                      <Controller
                        name='pickNumber'
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            value={field.value}
                            onValueChange={(value: any) =>
                              field.onChange(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Supermodel Type' />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value='Master Structure'>
                                Master Structure
                              </SelectItem>
                              <SelectItem value='Project Area'>
                                Project Area
                              </SelectItem>
                              <SelectItem value='Inspection Area'>
                                Inspection Area
                              </SelectItem>
                              <SelectItem value='Inspection Type'>
                                Inspection Type
                              </SelectItem>
                              <SelectItem value='Component'>
                                Component
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage>
                      {form.formState.errors.pickNumber?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* <Button variant='outline'>
                Upload Image
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  ref={uploadImageRef}
                  onChange={handleUploadImage}
                />
              </Button>
              <Button variant='outline'>
                Upload PDF
                <input
                  type='file'
                  hidden
                  accept='.pdf'
                  ref={uploadPdfRef}
                  onChange={handleUploadPdf}
                />
              </Button> */}
              <FormField
                control={form.control}
                name='pickNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selections</FormLabel>
                    <FormControl>
                      <Controller
                        name='file'
                        control={form.control}
                        render={({ field }) => (
                          <FileUploader
                            onValueChange={(value: any) => {
                              console.log(value)
                              field.onChange(value[0])
                              handleUploadPdf(value[0])
                            }}
                            // dropzoneOptions={dropZoneConfig}
                            value={field.value}
                            dropzoneOptions={{
                              accept: {
                                'image/*': [
                                  '.jpg',
                                  '.jpeg',
                                  '.png',
                                  '.pdf',
                                ],
                              },
                            }}
                            className='relative rounded-lg bg-background p-2'
                          >
                            <FileInput className='outline-dashed outline-1 outline-white'>
                              <div className='flex w-full flex-col items-center justify-center pb-4 pt-3 '>
                                <FileSvgDraw />
                              </div>
                            </FileInput>
                            <FileUploaderContent>
                              {form.getValues('file') && (
                                <FileUploaderItem index={0}>
                                  <Paperclip className='h-4 w-4 stroke-current' />
                                  <span>{form.getValues('file')?.name}</span>
                                </FileUploaderItem>
                              )}
                            </FileUploaderContent>
                          </FileUploader>
                        )}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage>
                      {form.formState.errors.pickNumber?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='mt-2 flex h-8 w-fit items-center justify-center'
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default UploadModal
