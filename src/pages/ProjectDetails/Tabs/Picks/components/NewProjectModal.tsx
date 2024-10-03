//@ts-nocheck
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import projectApi from '@/service/projectApi'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Use Toggle component for chip-like structure

const attributes = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Enter Project name',
  },
  {
    name: 'clientName',
    type: 'text',
    placeholder: 'Client name',
  },
  {
    name: 'Inspector name',
    type: 'text',
    placeholder: 'Inspector name',
  },
]

const NewProjectModal = () => {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState('')
  const [fields, setFields] = useState([{ name: '', type: '' }])
  const [selectedConfigurations, setSelectedConfigurations] = useState<
    string[]
  >([])

  const [modelAttributesData, setModelAttributesData] = useState([])

  const handleCreateProject = () => {}

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = value
    setFields(updatedFields)
  }

  const addField = () => {
    setFields([...fields, { name: '', type: '' }])
  }

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index)
    setFields(updatedFields)
  }

  const handleConfigurationChange = (config: string) => {
    setSelectedConfigurations((prevConfigs) =>
      prevConfigs.includes(config)
        ? prevConfigs.filter((c) => c !== config)
        : [...prevConfigs, config]
    )
  }

  const configurations = ['Config A', 'Config B', 'Config C'] // Your predefined configurations

  const createProjectModel = async () => {
    const data = {
      name: projectName,
      attributes: modelAttributesData,
      pickModelId: '37beca76-4e81-4f6b-a522-4bf2296d9dcb',
    }
    try {
      const response = await projectApi.createProjectModel(projectId, data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex h-8 items-center justify-center gap-2 p-2'>
          New Project Model
          <Plus size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Project Model</DialogTitle>
          <DialogDescription>
            Enter the details below to create a new project model.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Project Name */}
          <div>
            <label
              htmlFor='project-name'
              className='text-sm dark:text-gray-300'
            >
              Project Model Name
            </label>
            <Input
              id='project-name'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className='mt-1 w-full'
              placeholder='Enter your project model name'
            />
          </div>

          {/* Dynamic Inputs */}
          <div className='space-y-4'>
            Datas required from model configuration
            {attributes.map((attribute) => (
              <div key={attribute.name} className='flex flex-col'>
                <Input
                  id={attribute.name}
                  type={attribute.type}
                  placeholder={attribute.placeholder}
                  className=' w-full'
                  onChange={(e) => {
                    const modelAttribute = modelAttributesData.find(
                      (attr) => attr.name === attribute.name
                    )
                    if (modelAttribute) {
                      modelAttribute.value = e.target.value
                    } else {
                      setModelAttributesData([
                        ...modelAttributesData,
                        {
                          name: attribute.name,
                          type: attribute.type,
                          value: e.target.value,
                        },
                      ])
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button onClick={createProjectModel}>Create Project modal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectModal
