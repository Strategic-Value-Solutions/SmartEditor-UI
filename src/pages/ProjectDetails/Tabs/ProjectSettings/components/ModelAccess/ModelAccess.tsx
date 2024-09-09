//@ts-nocheck
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import projectAccessApi from '@/service/projectAccessApi'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ModelAccess = () => {
  const { projectId } = useParams()

  const [collaborators, setCollaborators] = useState([])
  const [selectedCollaborator, setSelectedCollaborator] = useState(null)
  const [selectedPages, setSelectedPages] = useState([])
  const [currentProjectIndex, setCurrentProjectIndex] = useState(null)
  const [lastClickedPage, setLastClickedPage] = useState(null)
  const [
    selectedCollaboratorProjectModelAccess,
    setSelectedCollaboratorProjectModelAccess,
  ] = useState([])

  const getCollaborators = async () => {
    try {
      const response = await projectAccessApi.getProjectAccess(projectId)
      setCollaborators(response)

      if (response.length > 0) {
        setSelectedCollaborator(response[0])
        getCollaboratorProjectModelAccess(selectedCollaborator)
      }
    } catch (error) {
      console.error('Error fetching project access:', error)
    }
  }

  const getCollaboratorProjectModelAccess = async (collaborator) => {
    // const query = collaborator?.user?.id
    const query = `?userId=${collaborator?.user?.id}`
    try {
      const response = await projectAccessApi.getProjectModelAccess(
        projectId,
        query
      )
      setSelectedCollaboratorProjectModelAccess(response)
    } catch (error) {
      console.error('Error fetching project access:', error)
    }
  }

  useEffect(() => {
    getCollaborators()
  }, [projectId])

  useEffect(() => {
    if (!selectedCollaborator) return
    getCollaboratorProjectModelAccess(selectedCollaborator)
  }, [selectedCollaborator])

  const handleProjectAccessChange = async (
    newAccess,
    collaboratorProjectModelAccessId
  ) => {
    try {
      const response = await projectAccessApi.updateProjectModelAccess(
        projectId,
        collaboratorProjectModelAccessId,
        {
          permission: newAccess,
        }
      )
      getCollaboratorProjectModelAccess(selectedCollaborator)
    } catch (error) {
      console.error('Error updating project access:', error)
    }
  }

  const handleCollaborator = (collaborator) => {
    setSelectedCollaborator(collaborator)
  }

  return (
    <div className='flex flex-col lg:flex-row h-full bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar: Vertical Tab Bar */}
      <div className='w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4'>
        <h3 className='text-md font-semibold text-gray-700 dark:text-gray-300 mb-4'>
          Collaborators
        </h3>
        <ul className='space-y-2'>
          {collaborators?.map((collaborator, index) => (
            <li key={index} onClick={() => handleCollaborator(collaborator)}>
              <div
                className={`w-full py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                  selectedCollaborator?.id === collaborator.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className='flex items-center'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center mr-3 text-white font-semibold shadow-sm'>
                    {collaborator?.user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-medium'>
                      {collaborator?.user?.name}
                    </span>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      {collaborator?.user?.email}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content: Project Details */}
      <div className='w-full lg:w-3/4 p-2 lg:p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-medium text-gray-700 dark:text-gray-300'>
            Model Access - {selectedCollaborator?.user?.name}
          </h2>
          <Button
            variant='destructive'
            size='sm'
            className='flex items-center gap-2 p-2 h-8'
            onClick={() => handleRemoveAccess(selectedCollaboratorIndex)}
          >
            Remove Access
            <Trash2 size={16} />
          </Button>
        </div>
        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
          {selectedCollaborator?.user?.email}
        </p>

        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg overflow-x-auto'>
          <Table className='min-w-full dark:bg-gray-800'>
            <TableHeader>
              <TableRow>
                <TableHead className='dark:text-gray-300'>Model Name</TableHead>
                <TableHead className='dark:text-gray-300'>
                  Access Level
                </TableHead>
                {/* <TableHead className='dark:text-gray-300'>Edit Pages</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCollaboratorProjectModelAccess?.map(
                (collaboratorProjectModelAccess, index) => (
                  <TableRow key={index} className='dark:border-gray-700'>
                    <TableCell className='dark:text-gray-300'>
                      {
                        collaboratorProjectModelAccess?.projectModel?.pickModel
                          ?.name
                      }
                    </TableCell>
                    <TableCell>
                      <Select
                        value={collaboratorProjectModelAccess.permission}
                        onValueChange={(value) =>
                          handleProjectAccessChange(
                            value,
                            collaboratorProjectModelAccess.id
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue className='dark:text-gray-300'>
                            {collaboratorProjectModelAccess.permission}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className='dark:bg-gray-700'>
                          <SelectItem value='OWNER'>OWNER</SelectItem>
                          <SelectItem value='VIEWER'>VIEWER</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    {/* <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-gray-700 dark:text-gray-300'
                          onClick={() => {
                            setSelectedPages(project.pageAccess)
                            setCurrentProjectIndex(projectIndex)
                          }}
                        >
                          <Pencil className='w-3 h-3 mr-1' />
                          Edit Pages
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='bg-white dark:bg-gray-800 p-4 rounded-lg '>
                        <DialogClose className='absolute right-2 top-2'>
                          <span className='sr-only'>Close</span>
                        </DialogClose>
                        <h3 className='text-md font-semibold mb-4 dark:text-gray-300'>
                          Edit Page Access - {project.name}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          {Array.from(
                            { length: project.totalPages },
                            (_, i) => (
                              <Button
                                key={i}
                                className={`p-1 w-8 border rounded text-sm ${
                                  selectedPages.includes(i + 1)
                                    ? 'bg-blue-200 dark:bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                                onClick={() => handlePageClick(i + 1)}
                              >
                                {i + 1}
                              </Button>
                            )
                          )}
                        </div>
                        <div className='flex justify-end space-x-2 mt-4'>
                          <Button
                            className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-blue-700 dark:text-gray-300'
                            onClick={handleSavePages}
                          >
                            Save Changes
                          </Button>
                          <DialogClose asChild>
                            <Button className='flex h-8 items-center justify-center gap-2 p-2 dark:bg-gray-700 dark:text-gray-300'>
                              Cancel
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell> */}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default ModelAccess
