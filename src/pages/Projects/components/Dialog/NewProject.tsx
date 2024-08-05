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
import { Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentProject, addProject } from '@/store/slices/projectSlice'
import { RootState } from '@/store'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const newProjectSchema = z.object({
  projectName: z.string().nonempty('Project name is required'),
  siteName: z.string().nonempty('Site name is required'),
  superModel: z.string().nonempty('Supermodel Type is required'),
  config: z.string().nonempty('Configuration is required'),
})

const NewProject = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
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
    setConfigs(configsData)
  }, [configsData])

  const handleModal = () => {
    setOpen(!open)
  }

  const onSubmit = async (data) => {
    // Store the project name in the context
    const projectData = {
      projectName: data.projectName,
      siteName: data.siteName,
      supermodelType: data.supermodelType,
      config: configs.find((config) => config._id === data.config),
    }

    // Store the project data in the Redux state
    dispatch(setCurrentProject(projectData))
    dispatch(addProject(projectData))

    form.reset() // Reset the form fields
    handleModal() // Close the modal
    // navigate('/editor') // Navigate to the editor route
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger>
          <Button
            onClick={handleModal}
            className='flex h-8 items-center justify-center gap-2 p-2'
          >
            New Project
            <Plus size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new</DialogTitle>
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
                  render={({ field, fieldState: { error } }) => (
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
                  render={({ field, fieldState: { error } }) => (
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
                  render={({ field, fieldState: { error } }) => (
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
                  render={({ field, fieldState: { error } }) => (
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
                              key={Math.random().toString(36).substring(7)}
                              value={config.mcc}
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
                  Create
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
