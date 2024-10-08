// @ts-nocheck
import { Button } from '@/components/ui/button'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import projectModelConfigurationApi from '@/service/modelConfigurationApi'
import { RootState } from '@/store'
import {
  addModelConfiguration,
  updateModelConfiguration,
} from '@/store/slices/modelConfigurationSlice'
import { Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { v4 } from 'uuid'

const NewModelConfiguration = ({
  isEdit = false,
  selectedModelConfiguration,
  onClose,
  open,
}: any) => {
  const form = useForm()
  const [fields, setFields] = useState<any[]>([]) // Initialize as an empty array
  const [selectedConfigs, setSelectedConfigs] = useState<any[]>([])

  const dispatch = useDispatch()
  const modelConfigurationsData = useSelector(
    (state: RootState) => state.modelConfiguration.modelConfigurationsData || []
  )

  useEffect(() => {
    if (isEdit && selectedModelConfiguration) {
      form.setValue('name', selectedModelConfiguration.name)
      setFields(
        (selectedModelConfiguration.attributes || []).map((field: any) => ({
          fieldName: field.name,
          fieldType: field.type,
        }))
      )
      setSelectedConfigs([selectedModelConfiguration])
    } else {
      form.reset()
      setFields([])
      setSelectedConfigs([])
    }
  }, [isEdit, selectedModelConfiguration, form])

  const handleSelectConfig = (config: any) => {
    const isAlreadySelected = selectedConfigs.some(
      (selected) => selected.id === config.id
    )
    if (isAlreadySelected) {
      setSelectedConfigs(
        selectedConfigs.filter((selected) => selected.id !== config.id)
      )
    } else {
      setSelectedConfigs([...selectedConfigs, config])
    }
  }

  const onSubmit = async (data: any) => {
    const attributes = fields.map((field) => ({
      name: field.fieldName,
      type: field.fieldType,
    }))

    if (!data.name) {
      toast.error('Please enter a model name')
      return
    }
    if (attributes.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    const isMissingFields = attributes.some(
      (field) => !field.name || !field.type
    )
    if (isMissingFields) {
      toast.error('Please fill in all fields')
      return
    }

    const newConfig = {
      id: isEdit ? selectedModelConfiguration.id : v4(), // Use existing ID if editing
      name: data.name,
    }

    if (isEdit) {
      dispatch(updateModelConfiguration(newConfig))
      await projectModelConfigurationApi.updateModel(
        selectedModelConfiguration.id,
        newConfig
      )
    } else {
      await projectModelConfigurationApi.createModel({
        name: newConfig.name,
        attributes,
        configurations: selectedConfigs,
      })
      dispatch(
        addModelConfiguration({
          ...newConfig,
          attributes,
          associatedConfigs: selectedConfigs,
          lastUpdate: new Date().toISOString(),
        })
      )
    }

    onClose()
    form.reset()
  }

  const addField = () => {
    setFields([...fields, { fieldName: '', fieldType: '' }])
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? 'Update Model Configuration'
              : 'Create New Model Configuration'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Model name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <div key={index} className='flex items-center gap-4'>
                      <FormField
                        control={form.control}
                        name={`fields[${index}].fieldName`}
                        render={() => (
                          <FormItem className='flex-1'>
                            <FormControl>
                              <Input
                                placeholder='Enter Field Name'
                                value={field.fieldName}
                                onChange={(e) => {
                                  const newFields = [...fields]
                                  newFields[index].fieldName = e.target.value
                                  setFields(newFields)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`fields[${index}].fieldType`}
                        render={() => (
                          <FormItem className='flex-1'>
                            <Select
                              onValueChange={(value) =>
                                setFields(
                                  fields.map((f, i) =>
                                    i === index ? { ...f, fieldType: value } : f
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
                                <SelectItem value='number'>Number</SelectItem>
                                <SelectItem value='date'>Date</SelectItem>
                                <SelectItem value='pdf'>PDF File</SelectItem>
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
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <FormLabel>Select Configurations</FormLabel>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {modelConfigurationsData.map((config) => (
                    <Button
                      type='button'
                      className={`h-8 p-2 ${
                        selectedConfigs.some((c) => c.id === config.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                      key={config.id}
                      onClick={() => handleSelectConfig(config)}
                      variant={
                        selectedConfigs.some((c) => c.id === config.id)
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {config.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type='submit'
                className='mt-6 flex h-10 w-full items-center justify-center'
              >
                {isEdit
                  ? 'Update Model Configuration'
                  : 'Create Model Configuration'}
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default NewModelConfiguration
