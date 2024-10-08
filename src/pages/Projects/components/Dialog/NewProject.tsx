//@ts-nocheck
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
  FormDescription,
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
import projectApi from '@/service/projectApi'
import superStructureApi from '@/service/superStructureApi'
import { RootState } from '@/store'
import {
  addProject,
  setCurrentProject,
  updateProject,
} from '@/store/slices/projectSlice'
import { getErrorMessage } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const newProjectSchema = z.object({
  name: z.string().nonempty('Project name is required'),
  clientName: z.string().nonempty('Client name is required'),
  superStructureId: z.string().nonempty('Structure Type is required'),
  subStructureId: z.string().nonempty('SubStructure Type is required'),
  // config: z.string().nonempty('Configuration is required'),
})

const NewProject = ({
  isEdit = false,
  selectedProject,
  onClose,
  open,
  setFilteredProjects,
}: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [subStructures, setSubStructures] = useState([])

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      name: '',
      clientName: '',
      superStructureId: '',
      subStructureId: '',
      // config: '',
    },
  })
  const [configs, setConfigs] = useState([])
  const modelConfigurationsData = useSelector(
    (state: RootState) => state.modelConfiguration.modelConfigurationsData || []
  )
  const superStructures = useSelector(
    (state: RootState) => state.superStructure.superStructureData || []
  )

  useEffect(() => {
    if (isEdit && selectedProject) {
      form.setValue('name', selectedProject.name)
      form.setValue('clientName', selectedProject.clientName)
      form.setValue('superStructureId', selectedProject.superStructureId)
      form.setValue('subStructureId', selectedProject.subStructureId)
      // form.setValue('config', selectedProject.config.name)
    } else {
      form.reset()
    }
  }, [isEdit, selectedProject, form])

  useEffect(() => {
    setConfigs(modelConfigurationsData)
  }, [modelConfigurationsData])

  useEffect(() => {
    if (!form.getValues('superStructureId')) return

    const fetchSubStructures = async () => {
      try {
        const response = await superStructureApi.subStructures(
          form.getValues('superStructureId')
        )
        setSubStructures(response)
      } catch (error) {
        toast.error(getErrorMessage(error))
      }
    }

    fetchSubStructures()
  }, [form.watch('superStructureId')])

  const onSubmit = async (data) => {
    try {
      const projectData = {
        name: data.name,
        clientName: data.clientName,
        superStructureId: data.superStructureId,
        subStructureId: data.subStructureId,
      }

      if (isEdit) {
        const response = await projectApi.updateProject(
          selectedProject.id,
          projectData
        )

        dispatch(setCurrentProject(response))
        dispatch(updateProject(response))
      } else {
        const response = await projectApi.createProject(projectData)
        dispatch(setCurrentProject(response))
        dispatch(addProject(response))
        navigate(`/project/${response.id}`)
      }

      onClose()
      form.reset()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
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
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter Project name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='clientName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client name</FormLabel>
                      <FormControl>
                        <Input placeholder='Client name' {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='superStructureId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Structure Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Structure Type' />
                          </SelectTrigger>
                          <SelectContent>
                            {superStructures.map((superStructure: any) => (
                              <SelectItem
                                key={superStructure.id}
                                value={superStructure.id}
                              >
                                {superStructure.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {subStructures.length > 0 && (
                  <FormField
                    control={form.control}
                    name='subStructureId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SubStructure Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='SubStructure Type' />
                            </SelectTrigger>
                            <SelectContent>
                              {subStructures.map((subStructure: any) => (
                                <SelectItem
                                  key={subStructure.id}
                                  value={subStructure.id}
                                >
                                  {subStructure.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* <FormField
                  control={form.control}
                  name='config'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuration</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Configuration' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configs.map((config) => (
                            <SelectItem
                              key={config.name}
                              value={config.name}
                            >
                              {config.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <Button
                  type='submit'
                  className='mt-2 flex h-8 w-fit items-center justify-center'
                >
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default NewProject
