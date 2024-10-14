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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import projectApi from '@/service/projectApi'
import { AppDispatch, RootState } from '@/store'
import { addModelToCurrentProject } from '@/store/slices/projectModelSlice'
import { getErrorMessage } from '@/utils'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const NewProjectModal = () => {
  const { projectId } = useParams()
  const [customModelName, setCustomModelName] = useState('')
  const [selectedModelId, setSelectedModelId] = useState('')
  const [modelAttributesData, setModelAttributesData] = useState([])
  const [open, setOpen] = useState(false) // To manage modal state
  const dispatch = useDispatch<AppDispatch>()

  // Fetching model configurations from Redux store
  const modelConfigurationsData = useSelector(
    (state: RootState) => state.modelConfiguration.modelConfigurationsData || []
  )

  useEffect(() => {
    console.log(selectedModelId)
    // Reset attributes when a new model is selected
    if (selectedModelId) {
      const selectedModel = modelConfigurationsData.find(
        (model) => model.id === selectedModelId
      )
      if (selectedModel) {
        const initialAttributes = selectedModel?.attributes?.map(
          (attribute) => ({
            name: attribute.name,
            type: attribute.type,
            value: '', // Initial value for each attribute
          })
        )
        setModelAttributesData(initialAttributes)
      }
    }
  }, [selectedModelId, modelConfigurationsData])

  const handleCreateProject = async () => {
    const data = {
      attributes: modelAttributesData,
      pickModelId: selectedModelId,
      name: customModelName,
    }

    console.log(data)
    try {
      const response = await projectApi.createProjectModel(projectId, data)

      dispatch(addModelToCurrentProject(response))

      toast.success('Project created successfully')
      setOpen(false) // Close modal on success
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        className='flex h-8 items-center justify-center gap-2 p-2'
        onClick={() => setOpen(true)}
      >
        New Project Model
        <Plus size={20} />
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Project Model</DialogTitle>
          <DialogDescription>
            Enter the details below to create a new project model.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Model Dropdown */}
          <div className='flex flex-col gap-2'>
            <label
              className='text-sm dark:text-gray-300'
              htmlFor='custom-model-name'
            >
              Custom Model Name (Optional)
            </label>
            <small className='text-xsm dark:text-gray-300 text-gray-500'>
              You can use this to identify with custom name or we will use model
              configuration name
            </small>
            <Input
              type='text'
              placeholder='Enter custom model name'
              className='w-full'
              value={customModelName}
              onChange={(e) => setCustomModelName(e.target.value)}
              id='custom-model-name'
            />
          </div>
          <div>
            <label className='text-sm dark:text-gray-300'>
              Select Model Configuration
            </label>
            {console.log(modelConfigurationsData)}
            <Select onValueChange={(value) => setSelectedModelId(value)}>
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
          {selectedModelId && modelAttributesData?.length > 0 && (
            <div className='space-y-4'>
              <h4>Model Attributes</h4>
              {modelAttributesData?.map((attribute, index) => (
                <div key={attribute.name} className='flex items-center gap-2'>
                  <Label className='text-sm dark:text-gray-300 w-40'>
                    {attribute.name
                      .split(/(?=[A-Z])/)
                      .join(' ')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Label>

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
                      placeholder={`Enter ${attribute.name
                        .split(/(?=[A-Z])/)
                        .join(' ')
                        .replace(/^./, (str) => str.toUpperCase())}`}
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
            <Button variant='secondary' onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleCreateProject}>Create Project Model</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewProjectModal
