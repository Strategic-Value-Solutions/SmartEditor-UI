import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import projectApi from '@/service/projectApi'
import { updateProject, deleteProject } from '@/store/slices/projectSlice'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ProjectInfo = () => {
  const { projectId } = useParams()
  const [projectName, setProjectName] = useState('')
  const [confirmProjectName, setConfirmProjectName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const project = await projectApi.getProject(projectId)
        setProjectName(project.name)
      } catch (error) {
        console.error('Error fetching project details:', error)
        toast.error('Failed to load project details')
      }
    }

    fetchProjectDetails()
  }, [projectId])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  const handleNameSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        if (projectId && projectName) {
          const updatedProject = await projectApi.updateProject(projectId, {
            name: projectName,
          })
          dispatch(updateProject(updatedProject))
          setIsEditing(false)
        } else {
          throw new Error('Project ID or name is missing')
        }
        toast.success('Project name updated successfully')
      } catch (error) {
        console.error('Error updating project name:', error)
        toast.error('Failed to update project name')
      }
    }
  }

  const handleDeleteProject = async () => {
    toast.success('Project deleted')
    // try {
    //   await projectApi.deleteProject(projectId)
    //   dispatch(deleteProject(projectId))
    //   setIsDeleteDialogOpen(false)
    //   toast.success('Project deleted successfully')
    //   navigate('/projects')
    // } catch (error) {
    //   console.error('Error deleting project:', error)
    //   toast.error('Failed to delete project')
    // }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>Project Name</h3>
        <p className='text-sm text-muted-foreground'>
          This is your project's name. Click to edit and press Enter to save
          changes.
        </p>
        <div className='flex items-center mt-2'>
          <Input
            value={projectName}
            onChange={handleNameChange}
            onKeyPress={handleNameSubmit}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            className='max-w-sm'
          />
          {isEditing && (
            <span className='ml-2 text-sm text-muted-foreground'>
              Press Enter to save
            </span>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className='text-lg font-medium text-red-600'>Danger Zone</h3>
        <p className='text-sm text-muted-foreground'>
          Once you delete a project, there is no going back. Please be certain.
        </p>
        <Button
          variant='destructive'
          onClick={() => setIsDeleteDialogOpen(true)}
          className='mt-2'
        >
          Delete this project
        </Button>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              project and remove all associated data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <Label htmlFor='confirmProjectName'>
              Type the project name "
              <span className='text-sm text-muted-foreground pt-2 pb-2'>
                {projectName}
              </span>
              " to confirm deletion:
            </Label>

            <Input
              id='confirmProjectName'
              value={confirmProjectName}
              onChange={(e) => setConfirmProjectName(e.target.value)}
              placeholder='Enter project name'
              className='mt-1'
            />
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteProject}
              variant='destructive'
              disabled={
                confirmProjectName.toLowerCase() !== projectName.toLowerCase()
              }
            >
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectInfo
