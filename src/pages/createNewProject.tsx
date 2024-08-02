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
import { Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ProjectDataContext } from '../store/ProjectDataContext' // Import the ProjectDataContext
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const CreateNewProject = () => {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, control } = useForm()
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
          {' '}
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
            <DialogDescription>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  control={control}
                  name='title'
                  render={() => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        {' '}
                        <Input
                          fullWidth
                          placeholder='Project Title'
                          // {...register('projectName', {
                          //   required: 'Project Name is required',
                          //   maxLength: 50
                          // })}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='site name'
                  render={() => (
                    <FormItem>
                      <FormLabel />
                      <FormControl>
                        {' '}
                        <Input
                          fullWidth
                          placeholder='Site Name'
                          // {...register('projectName', {
                          //   required: 'Project Name is required',
                          //   maxLength: 50
                          // })} // Generate random value
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='supermodel'
                  render={() => (
                    <FormItem>
                      <FormLabel>Supermodel Type</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Theme' />
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

                {/* <FormControl fullWidth>
                  <InputLabel id='config-selector-label'>
                    Select Configuration
                  </InputLabel>
                  <Select
                    labelId='config-selector-label'
                    defaultValue=''
                    label='Select Configuration'
                    {...register('config')}
                  >
                    {configs.map((config) => (
                      <MenuItem
                        key={Math.random().toString(36).substring(7)}
                        value={config.mcc}
                      >
                        {config.model_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>


              */}

                <Button
                  variant='contained'
                  type='submit'
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Create Project
                </Button>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateNewProject
