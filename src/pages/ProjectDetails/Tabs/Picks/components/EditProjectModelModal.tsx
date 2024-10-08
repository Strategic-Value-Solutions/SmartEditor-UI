import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import { setProjectModels } from '@/store/slices/projectModelSlice'
import { getErrorMessage } from '@/utils'
import { Plus, Trash } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm, FormProvider, Controller } from 'react-hook-form'
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
  const [fields, setFields] = useState([
    { fieldName: '', fieldType: 'text', value: '' },
  ]) // Initialize fields with default values
  const formMethods = useForm() // Initialize react-hook-form
  const { control } = formMethods

  // Initialize fields with selectedPick.attributes
  useEffect(() => {
    if (selectedPick?.attributes) {
      setFields(
        selectedPick.attributes.map((attribute: any) => ({
          fieldName: attribute.name,
          fieldType: attribute.type,
          value: attribute.value,
        }))
      )
    }
  }, [selectedPick?.attributes])

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
        projectModel.id === selectedPick.id ? response : projectModel
      )
      dispatch(setProjectModels(updatedModels))
      setShowPickModal(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  // Function to add new field
  const addField = () => {
    setFields([...fields, { fieldName: '', fieldType: 'text' }])
  }

  // Function to render input based on the selected field type
  const renderFieldInput = (field: any, index: number) => {
    switch (field.fieldType) {
      case 'text':
        return (
          <Input
            placeholder='Enter text'
            value={field.value || ''}
            onChange={(e) => {
              const newFields = [...fields]
              newFields[index].value = e.target.value
              setFields(newFields)
            }}
          />
        )
      case 'number':
        return (
          <Input
            type='number'
            placeholder='Enter number'
            value={field.value || ''}
            onChange={(e) => {
              const newFields = [...fields]
              newFields[index].value = e.target.value
              setFields(newFields)
            }}
          />
        )
      case 'date':
        return (
          <Input
            type='date'
            value={field.value || ''}
            onChange={(e) => {
              const newFields = [...fields]
              newFields[index].value = e.target.value
              setFields(newFields)
            }}
          />
        )
      case 'pdf':
        return <p>Upload a PDF file</p>
      case 'image':
        return <p>Upload an image file</p>
      case '3d':
        return <p>Upload a 3D file</p>
      default:
        return null
    }
  }

  // When saving the modal, map fields back to selectedPick.attributes
  const handleSave = async (e: any) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await projectApi.createProjectModelAttributes(
        projectId,
        selectedPick.id,
        {
          attributes: fields.map((field) => ({
            name: field.fieldName,
            type: field.fieldType,
            value: field.value,
          })),
        }
      )
      setSelectedPick((prevState: any) => ({
        ...prevState,
        attributes: response,
      }))
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
          <DialogTitle>Project Model</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSave}>
              <div className='flex flex-col gap-2 h-full w-full items-center justify-center py-8'>
                {/* Dynamic fields */}
                <div className='flex flex-col'>
                  <div className='mb-4 flex items-center justify-between'>
                    <FormLabel>Fields</FormLabel>
                    <Button
                      onClick={addField}
                      className='flex items-center justify-center gap-1 px-3 py-1 text-sm font-light'
                      type='button'
                    >
                      <Plus size={16} />
                      Add Field
                    </Button>
                  </div>
                  <div className='space-y-4'>
                    {fields.length === 0 && (
                      <p className='text-center text-sm font-light text-muted-foreground'>
                        No fields added
                      </p>
                    )}
                    {fields.map((field, index) => (
                      <div key={index} className='flex flex-col gap-4'>
                        <div className='flex items-center gap-4'>
                          <FormField
                            control={control}
                            name={`fields[${index}].fieldName`}
                            render={() => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Controller
                                    control={control}
                                    name={`fields[${index}].fieldName`}
                                    render={({ field: formField }) => (
                                      <Input
                                        placeholder='Enter Field Name'
                                        {...formField}
                                        value={fields[index].fieldName}
                                        onChange={(e) => {
                                          const newFields = [...fields]
                                          newFields[index].fieldName =
                                            e.target.value
                                          setFields(newFields)
                                        }}
                                      />
                                    )}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`fields[${index}].fieldType`}
                            render={() => (
                              <FormItem className='flex-1'>
                                <Select
                                  onValueChange={(value) =>
                                    setFields(
                                      fields.map((f, i) =>
                                        i === index
                                          ? { ...f, fieldType: value }
                                          : f
                                      )
                                    )
                                  }
                                  value={field.fieldType}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Field Type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='text'>Text</SelectItem>
                                    <SelectItem value='number'>
                                      Number
                                    </SelectItem>
                                    <SelectItem value='date'>Date</SelectItem>
                                    <SelectItem value='pdf'>
                                      PDF File
                                    </SelectItem>
                                    <SelectItem value='image'>
                                      Image File
                                    </SelectItem>
                                    <SelectItem value='3d'>3D File</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type='button'
                            className='h-6 p-1'
                            onClick={() =>
                              setFields(fields.filter((_, i) => i !== index))
                            }
                            variant='destructive'
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                        {/* Show input based on the selected type */}
                        <div className='mt-2'>
                          {renderFieldInput(field, index)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className='mt-4' type='submit'>
                    Submit
                  </Button>
                </div>

                {/* Dropzone (moved to last) */}
                <div className='flex h-[10vh] w-full max-w-[50vw] items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 mt-4'>
                  {selectedPick?.file ? (
                    <p className='text-sm text-gray-600'>
                      <span className='font-medium'>
                        {selectedPick?.file?.name}
                      </span>
                    </p>
                  ) : (
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
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
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
            onClick={handleSave} // Save changes to selectedPick
            className='mt-2 h-8 px-4 flex items-center justify-center'
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Proceed'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectModelModal
