import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import projectEstimationApi from '@/service/projectEstimationApi'
import { Pencil, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const NewEstimation = ({
  estimations,
  setEstimations,
  estimationDetails,
  setEstimationDetails,
  resetForm,
  isUpdate,
  inspectors,
  projectComponents,
  estimation,
}: {
  estimations: ProjectEstimation[]
  setEstimations: (estimations: ProjectEstimation[]) => void
  estimationDetails: Partial<ProjectEstimation>
  setEstimationDetails: (estimationDetails: Partial<ProjectEstimation>) => void
  resetForm: () => void
  isUpdate: boolean
  inspectors: any[]
  projectComponents: any[]
  estimation: ProjectEstimation | null
}) => {
  const { projectId }: any = useParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const createEstimation = async (data: ProjectEstimation) => {
    try {
      const response = await projectEstimationApi.createProjectEstimation(
        projectId,
        data
      )
      setEstimations([...estimations, response])
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const updateEstimation = async (id: string, data: ProjectEstimation) => {
    try {
      const response = await projectEstimationApi.updateProjectEstimation(
        projectId,
        id,
        data
      )
      setEstimations(
        estimations.map((estimation: ProjectEstimation) =>
          estimation.id === id ? response : estimation
        )
      )
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { id, requiredDaysForCompletion, inspectorId, pickModelComponentId } =
      estimationDetails

    if (!pickModelComponentId) {
      return toast.error('Pick model component is required')
    }
    if (!requiredDaysForCompletion) {
      return toast.error('Required days for completion is required')
    }

    if (isUpdate && id) {
      await updateEstimation(id, {
        requiredDaysForCompletion,
        inspectorId,
        pickModelComponentId,
      } as ProjectEstimation)

      return
    }

    await createEstimation({
      requiredDaysForCompletion,
      inspectorId,
      pickModelComponentId,
    } as ProjectEstimation)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {isUpdate && estimation ? (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setEstimationDetails(estimation)
              setIsDialogOpen(true)
            }}
          >
            <Pencil className='h-4 w-4' />
          </Button>
        ) : (
          <Button
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            <PlusCircle className='mr-2 h-4 w-4' /> Add New Estimation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {estimationDetails.id ? 'Edit' : 'Add'} Estimation
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='pickModelComponentId'>Component</Label>
            <Select
              defaultValue='-1'
              value={estimationDetails.pickModelComponentId}
              onValueChange={(value) =>
                setEstimationDetails({
                  ...estimationDetails,
                  pickModelComponentId: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Component' />
              </SelectTrigger>
              <SelectContent>
                {projectComponents.map((component) => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor='inspectorId'>Inspector (optional)</Label>
            <Select
              defaultValue='-1'
              value={estimationDetails.inspectorId}
              onValueChange={(value) =>
                setEstimationDetails({
                  ...estimationDetails,
                  inspectorId: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select Inspector' />
              </SelectTrigger>
              <SelectContent>
                {inspectors.map((inspector) => (
                  <SelectItem key={inspector.id} value={inspector.userId}>
                    {inspector?.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor='requiredDaysForCompletion'>
              Number of days to complete{' '}
              {estimationDetails.pickModelComponentId
                ? `one ${
                    projectComponents.find(
                      (component) =>
                        component.id === estimationDetails.pickModelComponentId
                    )?.name
                  }`
                : ''}
            </Label>
            <Input
              id='requiredDaysForCompletion'
              value={estimationDetails.requiredDaysForCompletion}
              onChange={(e) =>
                setEstimationDetails({
                  ...estimationDetails,
                  requiredDaysForCompletion: e.target.value,
                })
              }
            />
          </div>
          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewEstimation
