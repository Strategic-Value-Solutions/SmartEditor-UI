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
import { RootState } from '@/store'
import { addConfig, updateConfig } from '@/store/slices/configurationSlice'
import { Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { v4 } from 'uuid'

const NewModelConfiguration = ({
  isEdit = false,
  selectedConfig,
  onClose,
  open,
}: any) => {
  const form = useForm()
  const [fields, setFields] = useState([])
  const [selectedConfigs, setSelectedConfigs] = useState([])

  const dispatch = useDispatch()
  const configsData = useSelector(
    (state: RootState) => state.configurations.configsData || []
  )

  useEffect(() => {
    if (isEdit && selectedConfig) {
      form.setValue('modelName', selectedConfig.modelName)
      setFields(
        selectedConfig.fieldsData.map((field) => ({
          fieldName: field.name,
          fieldType: field.type,
          fieldValues: field.values || [{ fieldValue: '' }],
        }))
      )
      setSelectedConfigs([selectedConfig])
    } else {
      form.reset()
      setFields([])
      setSelectedConfigs([])
    }
  }, [isEdit, selectedConfig, form])

  const handleSelectConfig = (config) => {
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

  const onSubmit = (data) => {
    const fieldsData = fields.map((field) => ({
      name: field.fieldName,
      type: field.fieldType,
      values: field.fieldValues.map((fv) => ({ fieldValue: fv.fieldValue })),
    }))

    if (!data.modelName) {
      toast.error('Please enter a model name')
      return
    }
    if (fieldsData.length === 0) {
      toast.error('Please have at least one field')
      return
    }

    const isMissingFields = fieldsData.some(
      (field) => !field.name || !field.type || field?.fieldValues?.length === 0
    )
    if (isMissingFields) {
      toast.error('Please fill in all fields')
      return
    }

    const newConfig = {
      id: isEdit ? selectedConfig.id : v4(), // Use existing ID if editing
      modelName: data.modelName,
      fieldsData: fieldsData,
      associatedConfigs: selectedConfigs,
      lastUpdate: new Date().toISOString(), // Add a timestamp for the last update
    }

    if (isEdit) {
      dispatch(updateConfig(newConfig))
    } else {
      dispatch(addConfig(newConfig))
    }

    onClose()
    form.reset()
  }

  const addField = () => {
    setFields([
      ...fields,
      { fieldName: '', fieldType: '', fieldValues: [{ fieldValue: '' }] },
    ])
  }

  const addFieldValue = (fieldIndex) => {
    const newFields = [...fields]
    newFields[fieldIndex].fieldValues.push({ fieldValue: '' })
    setFields(newFields)
  }

  const removeFieldValue = (fieldIndex, valueIndex) => {
    const newFields = [...fields]
    newFields[fieldIndex].fieldValues.splice(valueIndex, 1)
    setFields(newFields)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Update Template' : 'Create New Template'}
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
                name='modelName'
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
                    <div key={index} className='flex flex-col space-y-2'>
                      <div className='flex items-center gap-4'>
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
                      {field.fieldValues.map((fieldValue, valueIndex) => (
                        <div
                          key={valueIndex}
                          className='flex items-center gap-4'
                        >
                          <FormField
                            control={form.control}
                            name={`fields[${index}].fieldValues[${valueIndex}].fieldValue`}
                            render={() => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Input
                                    placeholder='Enter Field Value'
                                    value={fieldValue.fieldValue}
                                    onChange={(e) => {
                                      // Create a deep copy of the fields array
                                      const newFields = fields.map(
                                        (field, i) => {
                                          if (i === index) {
                                            return {
                                              ...field,
                                              fieldValues:
                                                field.fieldValues.map(
                                                  (fv, vi) => {
                                                    if (vi === valueIndex) {
                                                      return {
                                                        ...fv,
                                                        fieldValue:
                                                          e.target.value,
                                                      }
                                                    }
                                                    return fv
                                                  }
                                                ),
                                            }
                                          }
                                          return field
                                        }
                                      )

                                      setFields(newFields)
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type='button'
                            className='h-6 p-1'
                            onClick={() => removeFieldValue(index, valueIndex)}
                            variant='destructive'
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addFieldValue(index)}
                        className='self-start mt-2 text-sm'
                        type='button'
                      >
                        Add Field Value
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-6'>
                <FormLabel>Select Configurations</FormLabel>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {configsData.map((config) => (
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
                      {config.modelName}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type='submit'
                className='mt-6 flex h-10 w-full items-center justify-center'
              >
                {isEdit ? 'Update Template' : 'Create Template'}
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default NewModelConfiguration
