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
import { Plus, X } from 'lucide-react'
import { useState } from 'react'

// Use Toggle component for chip-like structure

const NewProjectModal = () => {
  const [projectName, setProjectName] = useState('')
  const [fields, setFields] = useState([{ name: '', type: '' }])
  const [selectedConfigurations, setSelectedConfigurations] = useState<
    string[]
  >([])

  const handleCreateProject = () => {
    
    
    
  }

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
          <div>
            <label className='text-sm dark:text-gray-300'>Fields</label>
            {fields.map((field, index) => (
              <div key={index} className='flex gap-2 items-center mt-2'>
                <Input
                  value={field.name}
                  onChange={(e) =>
                    handleFieldChange(index, 'name', e.target.value)
                  }
                  placeholder='Field Name'
                  className='w-2/3'
                />
                <Select
                  className='w-1/3'
                  value={field.type}
                  onValueChange={(value) =>
                    handleFieldChange(index, 'type', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='text'>Text</SelectItem>
                    <SelectItem value='number'>Number</SelectItem>
                    <SelectItem value='date'>Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => removeField(index)} variant='danger'>
                  <X size={16} />
                </Button>
              </div>
            ))}
            <Button className='mt-2' onClick={addField}>
              Add Field
              <Plus size={16} />
            </Button>
          </div>

          {/* Toggle Selection for Configurations */}
          <div>
            <label className='text-sm dark:text-gray-300'>
              Select Configurations
            </label>
            <div className='flex gap-2 mt-2'>
              {configurations.map((config) => (
                <Toggle
                  key={config}
                  pressed={selectedConfigurations.includes(config)}
                  onPressedChange={() => handleConfigurationChange(config)}
                  className={`px-3 py-1 rounded-full border ${selectedConfigurations.includes(config) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {config}
                </Toggle>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectModal
