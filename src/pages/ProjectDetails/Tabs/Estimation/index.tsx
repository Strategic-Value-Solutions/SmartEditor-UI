import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import projectAccessApi from '@/service/projectAccessApi'
import projectApi from '@/service/projectApi'
import projectEstimationApi from '@/service/projectEstimationApi'
import { GanttChart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NewEstimation from './NewEstimation'
import App from './GanttChart'

export default function Estimation() {
  const { projectId }: any = useParams()

  const [estimations, setEstimations] = useState<ProjectEstimation[]>([])
  const [estimationDetails, setEstimationDetails] = useState<
    Partial<ProjectEstimation>
  >({
    requiredDaysForCompletion: '',
    inspectorId: '-1',
    pickModelComponentId: '-1',
  })

  const [components, setComponents] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])

  useEffect(() => {
    getAllEstimations()
    getAllComponents()
    getAllInspectors()
    getAnalytics()
  }, [])

  const getAllEstimations = async () => {
    try {
      const response =
        await projectEstimationApi.getProjectEstimations(projectId)
      setEstimations(response)
    } catch (error) {
      console.error(error)
    }
  }

  const deleteEstimation = async (id: string) => {
    try {
      await projectEstimationApi.deleteProjectEstimation(projectId, id)
      setEstimations(estimations.filter((estimation) => estimation.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    setEstimationDetails({
      id: '-1',
      requiredDaysForCompletion: '',
      inspectorId: '-1',
      pickModelComponentId: '-1',
    })
  }

  const getAllComponents = async () => {
    try {
      const response = await projectApi.getProjectComponents(projectId)
      setComponents(response)
    } catch (error) {
      console.error(error)
    }
  }

  const getAllInspectors = async () => {
    try {
      const response = await projectAccessApi.getProjectAccess(projectId)
      setInspectors(response)
    } catch (error) {
      console.error(error)
    }
  }

  const getAnalytics = async () => {
    try {
      const response = await projectEstimationApi.getAnalytics(projectId)
      console.log(response)
      //   setAnalytics(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='mx-auto p-2 space-y-2 w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-sm text-gray-700 text-primary'>
          Work Estimations can be set manually for project and this helps in
          estimating the project time after annotations
        </h1>
        <NewEstimation
          estimations={estimations}
          setEstimations={setEstimations}
          estimationDetails={estimationDetails}
          setEstimationDetails={setEstimationDetails}
          resetForm={resetForm}
          isUpdate={false}
          inspectors={inspectors}
          projectComponents={components}
          estimation={null}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Inspector</TableHead>
            <TableHead>Required Days</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estimations.map((estimation) => (
            <TableRow key={estimation.id}>
              <TableCell>
                {estimation?.pickModelComponent?.name || 'N/A'}
              </TableCell>
              <TableCell>{estimation?.inspector?.name || 'N/A'}</TableCell>
              <TableCell>{estimation.requiredDaysForCompletion}</TableCell>
              <TableCell className='text-right'>
                <NewEstimation
                  estimations={estimations}
                  setEstimations={setEstimations}
                  estimationDetails={estimationDetails}
                  setEstimationDetails={setEstimationDetails}
                  resetForm={resetForm}
                  isUpdate={true}
                  inspectors={inspectors}
                  projectComponents={components}
                  estimation={estimation}
                />

                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => deleteEstimation(estimation.id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <App />
    </div>
  )
}
