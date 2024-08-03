// @ts-nocheck

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Cross, Plus } from 'lucide-react'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProjectDataContext } from '../../../store/ProjectDataContext'

const NewTemplate = ({ trigger = null, isEdit = false }: any) => {
  const form = useForm()
  const { configsData, setConfigsData } = useContext(ProjectDataContext)
  const [fields, setFields] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedConfigs, setSelectedConfigs] = useState([])

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

  const handleModal = () => {
    setOpen(!open)
  }

  const onSubmit = (data) => {
    const fieldsData = fields.map((field) => ({
      name: field.fieldName,
      type: field.fieldType,
    }))

    const newConfig = {
      id: Math.max(...configsData.map((c) => c.id)) + 1, // generate a new unique ID
      model_name: data.modelName,
      fields_data: fieldsData,
      associated_configs: selectedConfigs,
      last_update: new Date().toISOString(), // Add a timestamp for the last update
    }

    setConfigsData([...configsData, newConfig])
    console.log('New configuration added successfully:', newConfig)
    form.reset()
    handleModal()
  }

  const addField = () => {
    setFields([...fields, { fieldName: '', fieldType: '' }])
  }

  return (
    <Dialog>
      <DialogTrigger>
        {isEdit ? (
          <>{trigger}</>
        ) : (
          <Button
            onClick={handleModal}
            className='flex h-8 items-center justify-center gap-2 p-2'
          >
            New Template
            <Plus size={20} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{!isEdit? 'Create': 'Update'}</DialogTitle>
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
                name='modelName'
                onChange={(e) =>
                  setFields(
                    fields.map((f, i) =>
                      i === index ? { ...f, modelName: e.target.value } : f
                    )
                  )
                }
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Model name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Model name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex w-full flex-col'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='mb-2 text-left'>Fields</FormLabel>
                  <Button
                    startIcon={<Plus />}
                    onClick={addField}
                    className='flex h-6 w-fit items-center justify-center bg-gray-600 text-sm font-light'
                    type='button'
                  >
                    Add Field
                  </Button>
                </div>
                <div className='flex w-full max-w-lg items-center gap-4 rounded-md border p-2'>
                  {fields.length === 0 && (
                    <p className='w-full text-center text-sm font-light text-gray-500'>
                      No fields added
                    </p>
                  )}
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className='flex w-full max-w-lg items-center gap-4'
                    >
                      <div className='flex w-[50%] flex-col items-center'>
                        <FormField
                          control={form.control}
                          name={`fields[${index}].fieldName`}
                          onChange={(e) =>
                            setFields(
                              fields.map((f, i) =>
                                i === index
                                  ? { ...f, fieldName: e.target.value }
                                  : f
                              )
                            )
                          }
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              {/* <FormLabel>Field Name</FormLabel> */}
                              <FormControl>
                                <Input
                                  placeholder='Enter Field Name'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='flex w-[30%] flex-col items-center'>
                        <FormField
                          control={form.control}
                          name={`fields[${index}].config`}
                          render={({ field }) => (
                            <FormItem className='w-full'>
                              {/* <FormLabel>Field Type</FormLabel> */}
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
                                defaultValue={field.fieldType}
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
                      </div>

                      <div className='flex w-[10%] justify-end'>
                        <Button
                          type='button'
                          className='h-6 p-1'
                          onClick={() =>
                            setFields(fields.filter((_, i) => i !== index))
                          }
                          size={'sm'}
                        >
                          <Plus size={15} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='mt-3'>
                <p variant='subtitle1'>Select Configurations:</p>
                <div className='mt-2'>
                  {configsData.map((config) => (
                    <Button
                      type='button'
                      className='br-4 m-1 h-7 p-2'
                      key={config.id}
                      onClick={() => handleSelectConfig(config)}
                      variant={
                        selectedConfigs.some((c) => c.id === config.id)
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {config.model_name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type='submit'
                className='mt-2 flex h-8 w-fit items-center justify-center'
              >
                {!isEdit? 'Create': 'Update'}
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default NewTemplate
