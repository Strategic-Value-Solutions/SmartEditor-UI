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
import { ProjectDataContext } from '../../../store/ProjectDataContext'

const NewProject = () => {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const form = useForm({
    defaultValues: {
      projectName: '',
      siteName: '',
      superModel: '',
      config: '',
    },
  })
  const [configs, setConfigs] = useState([])
  const { setProjectsData, configsData, setProjectName } =
    useContext(ProjectDataContext) // Get configsData and setProjectName from context

  useEffect(() => {
    // Set configs from context data
    setConfigs(configsData)
  }, [configsData]) // Update configs whenever configsData changes

  const handleModal = () => {
    setOpen(!open)
  }

  const onSubmit = async (data) => {
    // Store the project name in the context
    setProjectName(data.projectName)

    reset() // Reset the form fields
    navigate('/editor') // Navigate to the editor route
  }

  return (
    <>
      <Dialog>
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
                  render={() => (
                    <FormItem>
                      <FormLabel>Supermodel Type</FormLabel>
                      <FormControl>
                        <Select>
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
                              key={Math.random().toString(36).substring(7)}
                              value={config.mcc}
                            >
                              {config.model_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />{' '}
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
