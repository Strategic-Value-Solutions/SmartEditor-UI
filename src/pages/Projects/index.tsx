import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import NewProject from './components/Dialog/NewProject'
import Header from './components/Header'
import ProjectCard from './components/ProjectCard'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import projectApi from '@/service/projectApi'
import superStructureApi from '@/service/superStructureApi'
import { RootState } from '@/store'
import {
  deleteProject,
  setCurrentProject,
  setProjectsData,
} from '@/store/slices/projectSlice'
import { setSuperStructureData } from '@/store/slices/superStructureSlice'
import { getErrorMessage } from '@/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Projects = () => {
  const projectsData = useSelector(
    (state: RootState) => state.project.projectsData || []
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [openProjectModal, setOpenProjectModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEditButtonClick = (project) => {
    setSelectedProject(project)
    setIsEdit(true)
    setOpenProjectModal(true)
  }

  const handleDeleteButtonClick = (project) => {
    setSelectedProject(project)
    setOpenDeleteModal(true)
  }

  const handleClick = (project: any) => {
    dispatch(setCurrentProject(project))
    navigate(`/picks/${project.id}`)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedProject(null)
  }

  const onConfirm = async () => {
    if (!selectedProject?.id) {
      toast.error('Please select a project to delete')
      return
    }
    try {
      setLoading(true)
      const response = await projectApi.deleteProject(selectedProject.id)
      dispatch(deleteProject(selectedProject.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddProject = () => {
    setSelectedProject(null) // Clear selected template
    setIsEdit(false) // Set to create mode
    setOpenProjectModal(true)
  }

  const handleCloseProjectModal = () => {
    setOpenProjectModal(false)
    setSelectedProject(null) // Clear the selected template when modal is closed
    setIsEdit(false) // Reset edit mode
  }

  useEffect(() => {
    if (search === '') {
      setFilteredProjects(projectsData)
    } else {
      const filtered = projectsData.filter((project: any) => {
        return project.name.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredProjects(filtered)
    }
  }, [search])

  useEffect(() => {
    const fetchSuperStructures = async () => {
      try {
        setLoading(true)
        const response = await superStructureApi.getSuperStructures()
        dispatch(setSuperStructureData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchSuperStructures()
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjects()
        dispatch(setProjectsData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    setFilteredProjects(projectsData)
  }, [projectsData])

  // Separate the projects into different categories based on status
  const inProgressProjects = filteredProjects.filter(
    (project) => project.status === 'InProgress'
  )
  const draftProjects = filteredProjects.filter(
    (project) => project.status === 'Draft'
  )
  const completedProjects = filteredProjects.filter(
    (project) => project.status === 'Completed'
  )

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <h3 className='ml-3 flex h-8 flex-col pb-1 text-2xl'>Projects</h3>
      <Header
        setViewType={setViewType}
        viewType={viewType}
        onHandleAddProject={onHandleAddProject}
        setSearch={setSearch}
        search={search}
      />

      {viewType === 'grid' ? (
        <>
          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>In Progress</h4>
            <div className='flex flex-row flex-wrap gap-2'>
              {inProgressProjects.length > 0 ? (
                inProgressProjects.map((project: any, index: any) => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    handleClick={handleClick}
                    onConfirm={handleDeleteButtonClick}
                    onEdit={handleEditButtonClick}
                  />
                ))
              ) : (
                <p>No projects in progress.</p>
              )}
            </div>
          </div>

          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>Draft</h4>
            <div className='flex flex-row flex-wrap gap-2'>
              {draftProjects.length > 0 ? (
                draftProjects.map((project: any, index: any) => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    handleClick={handleClick}
                    onConfirm={handleDeleteButtonClick}
                    onEdit={handleEditButtonClick}
                  />
                ))
              ) : (
                <p>No draft projects.</p>
              )}
            </div>
          </div>

          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>Completed</h4>
            <div className='flex flex-row flex-wrap gap-2'>
              {completedProjects.length > 0 ? (
                completedProjects.map((project: any, index: any) => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    handleClick={handleClick}
                    onConfirm={handleDeleteButtonClick}
                    onEdit={handleEditButtonClick}
                  />
                ))
              ) : (
                <p>No completed projects.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>In Progress</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inProgressProjects.length > 0 ? (
                  inProgressProjects.map((project: any, index: any) => (
                    <TableRow key={project.id || index}>
                      <TableCell
                        onClick={() => handleClick(project)}
                        className='cursor-pointer'
                      >
                        {project.name}
                      </TableCell>
                      <TableCell className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          className='h-6 rounded p-1'
                          onClick={() => handleEditButtonClick(project)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteButtonClick(project)}
                          variant='destructive'
                          className='h-6 rounded bg-red-400 p-1'
                        >
                          <Trash2 size={15} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>No projects in progress.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>Draft</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draftProjects.length > 0 ? (
                  draftProjects.map((project: any, index: any) => (
                    <TableRow key={project.id || index}>
                      <TableCell
                        onClick={() => handleClick(project)}
                        className='cursor-pointer'
                      >
                        {project.name}
                      </TableCell>
                      <TableCell className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          className='h-6 rounded p-1'
                          onClick={() => handleEditButtonClick(project)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteButtonClick(project)}
                          variant='destructive'
                          className='h-6 rounded bg-red-400 p-1'
                        >
                          <Trash2 size={15} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>No draft projects.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='mt-4'>
            <h4 className='text-xl font-semibold'>Completed</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedProjects.length > 0 ? (
                  completedProjects.map((project: any, index: any) => (
                    <TableRow key={project.id || index}>
                      <TableCell
                        onClick={() => handleClick(project)}
                        className='cursor-pointer'
                      >
                        {project.name}
                      </TableCell>
                      <TableCell className='flex items-center justify-end gap-2'>
                        <Button
                          variant='outline'
                          className='h-6 rounded p-1'
                          onClick={() => handleEditButtonClick(project)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteButtonClick(project)}
                          variant='destructive'
                          className='h-6 rounded bg-red-400 p-1'
                        >
                          <Trash2 size={15} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>No completed projects.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      <ConfirmationDialog
        title='Delete Project'
        message='Are you sure you want to delete this project?'
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={onConfirm}
      />
      <NewProject
        open={openProjectModal}
        onClose={handleCloseProjectModal}
        isEdit={isEdit}
        selectedProject={selectedProject}
        setOpen={setOpenProjectModal}
      />
    </div>
  )
}

export default Projects
