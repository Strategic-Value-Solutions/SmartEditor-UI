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
import projectApi from '@/service/projectApi'
import { RootState } from '@/store'
import { getErrorMessage } from '@/utils'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const NewProjectModal = () => {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [modelAttributesData, setModelAttributesData] = useState([])

  // Fetching model configurations from Redux store
  const modelConfigurationsData = useSelector(
    (state: RootState) => state.modelConfiguration.modelConfigurationsData || []
  )

  useEffect(() => {
    // Reset attributes when a new model is selected
    if (selectedModelId) {
      const selectedModel = modelConfigurationsData.find(
        (model) => model.id === selectedModelId
      )
      if (selectedModel) {
        const initialAttributes = selectedModel.attributes.map((attribute) => ({
          name: attribute.name,
          type: attribute.type,
          value: '', // Initial value for each attribute
        }))
        setModelAttributesData(initialAttributes)
      }
    }
  }, [selectedModelId, modelConfigurationsData])

  const handleCreateProject = async () => {
    const data = {
      name: projectName,
      attributes: modelAttributesData,
      pickModelId: selectedModelId,
    }
    try {
      const response = await projectApi.createProjectModel(projectId, data)
      toast.success('Project created successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleAttributeChange = (index: number, value: string) => {
    const updatedAttributes = [...modelAttributesData]
    updatedAttributes[index].value = value
    setModelAttributesData(updatedAttributes)
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

          {/* Model Dropdown */}
          <div>
            <label className='text-sm dark:text-gray-300'>
              Select Model Configuration
            </label>
            <Select onValueChange={setSelectedModelId}>
              <SelectTrigger>
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent>
                {modelConfigurationsData.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Inputs Based on Selected Model */}
          {selectedModelId && modelAttributesData.length > 0 && (
            <div className='space-y-4'>
              <h4>Model Attributes</h4>
              {modelAttributesData.map((attribute, index) => (
                <div key={attribute.name} className='flex flex-col'>
                  <label className='text-sm dark:text-gray-300'>
                    {attribute.name}
                  </label>

                  {attribute.type === 'image' || attribute.type === 'pdf' ? (
                    <Input
                      type='file'
                      placeholder={`Upload ${attribute.name}`}
                      onChange={(e) =>
                        handleAttributeChange(index, e.target.value)
                      }
                    />
                  ) : (
                    <Input
                      type={attribute.type}
                      value={attribute.value}
                      placeholder={`Enter ${attribute.name}`}
                      onChange={(e) =>
                        handleAttributeChange(index, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateProject}>Create Project Model</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectModal
