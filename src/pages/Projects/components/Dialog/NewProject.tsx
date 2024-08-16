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
import { RootState } from '@/store'
import {
  addProject,
  setCurrentProject,
  updateProject,
} from '@/store/slices/projectSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import { z } from 'zod'

const newProjectSchema = z.object({
  projectName: z.string().nonempty('Project name is required'),
  siteName: z.string().nonempty('Site name is required'),
  superModel: z.string().nonempty('Supermodel Type is required'),
  config: z.string().nonempty('Configuration is required'),
})

const NewProject = ({
  isEdit = false,
  selectedProject,
  onClose,
  open,
}: any) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const form = useForm({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      projectName: '',
      siteName: '',
      superModel: '',
      config: '',
    },
  })
  const [configs, setConfigs] = useState([])

  const configsData = useSelector(
    (state: RootState) => state.configurations.configsData || []
  )

  useEffect(() => {
    if (isEdit && selectedProject) {
      form.setValue('projectName', selectedProject.projectName)
      form.setValue('siteName', selectedProject.siteName)
      form.setValue('superModel', selectedProject.supermodelType)
      form.setValue('config', selectedProject.config.modelName)
    } else {
      form.reset()
    }
  }, [isEdit, selectedProject, form])

  useEffect(() => {
    setConfigs(configsData)
  }, [configsData])

  const onSubmit = async (data) => {
    const projectData = {
      projectName: data.projectName,
      siteName: data.siteName,
      supermodelType: data.superModel,
      config: configs.find((config) => config.modelName === data.config),
      id: isEdit ? selectedProject.id : v4(),
    }

    dispatch(setCurrentProject(projectData))
    if (isEdit) {
      dispatch(updateProject(projectData))
    } else {
      dispatch(addProject(projectData))
    }

    onClose()
    form.reset()
    // navigate('/editor')
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
                  name='projectName'
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
                  name='siteName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site name</FormLabel>
                      <FormControl>
                        <Input placeholder='Site name' {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='superModel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supermodel Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Supermodel Type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Orthotropic'>
                              Orthotropic
                            </SelectItem>
                            <SelectItem value='Multistory Building'>
                              Multistory Building
                            </SelectItem>
                            <SelectItem value='Aviation Project'>
                              Aviation Project
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
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
                              key={config.modelName}
                              value={config.modelName}
                            >
                              {config.modelName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
