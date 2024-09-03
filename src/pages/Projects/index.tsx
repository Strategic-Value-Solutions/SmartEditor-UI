//@ts-nocheck
import NewProject from './components/Dialog/NewProject'
import Header from './components/Header'
import GridView from './components/Views/GridView'
import ListView from './components/Views/ListView'
import { projectsTour } from '@/Tours/constants'
import LandingPage from '@/components/Landing/Landing'
import Loader from '@/components/ui/Loader'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Separator } from '@/components/ui/separator'
import imageConstants from '@/constants/imageConstants'
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
import { useTour } from '@reactour/tour'
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
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [openProjectModal, setOpenProjectModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setIsOpen, setSteps, afterOpen } = useTour()
  const isProjectTourCompleted =
    localStorage.getItem('projectTourCompleted')?.toString() === 'true'
  const handleEditButtonClick = (project: any) => {
    setSelectedProject(project)
    setIsEdit(true)
    setOpenProjectModal(true)
  }

  const handleDeleteButtonClick = (project: any) => {
    setSelectedProject(project)
    setOpenDeleteModal(true)
  }

  const handleRedirectToProjectModelScreen = (project: any) => {
    dispatch(setCurrentProject(project))
    navigate(`/project/${project.id}`)
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
      await projectApi.deleteProject(selectedProject.id)
      dispatch(deleteProject(selectedProject.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddProject = () => {
    setSelectedProject(null)
    setIsEdit(false)
    setOpenProjectModal(true)
  }

  const handleCloseProjectModal = () => {
    setOpenProjectModal(false)
    setSelectedProject(null)
    setIsEdit(false)
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
        if (!isProjectTourCompleted) {
          setSteps(projectsTour)
          setIsOpen(true)
          localStorage.setItem('projectTourCompleted', 'true')
        }
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

  const inProgressProjects = filteredProjects.filter(
    (project: any) => project.status === 'In Progress'
  )
  const draftProjects = filteredProjects.filter(
    (project: any) => project.status === 'Draft'
  )
  const completedProjects = filteredProjects.filter(
    (project: any) => project.status === 'Completed'
  )


  const renderMainContent = () => {
    if (projectsData.length === 0) {
      return (
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='text-center md:text-left mb-4 md:mb-0 flex flex-col items-center md:w-1/2'>
            <h3 className='text-2xl font-bold'>No Projects Yet</h3>
            <p className='text-sm text-gray-600'>
              You haven’t created any projects. Start by creating your first
              project.
            </p>
          </div>

          <div className='w-full md:w-1/2'>
            <img
              src={imageConstants.noData}
              alt='No projects illustration'
              className='mx-auto md:ml-auto lg:max-w-[500px] w-full'
            />
            <p className='text-center text-sm text-gray-600 mt-4'>
              No Data Available
            </p>
          </div>
        </div>
      )
    } else {
      return viewType === 'grid' ? (
        <GridView
          inProgressProjects={inProgressProjects}
          draftProjects={draftProjects}
          completedProjects={completedProjects}
          handleRedirectToProjectModelScreen={
            handleRedirectToProjectModelScreen
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ) : (
        <ListView
          inProgressProjects={inProgressProjects}
          draftProjects={draftProjects}
          completedProjects={completedProjects}
          handleRedirectToProjectModelScreen={
            handleRedirectToProjectModelScreen
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      )
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <h3 className='flex h-8 flex-col pb-1 text-2xl'>Projects</h3>
      <Header
        setViewType={setViewType}
        viewType={viewType}
        onHandleAddProject={onHandleAddProject}
        setSearch={setSearch}
        search={search}
      />

      <Separator className='my-4' />
      {renderMainContent()}
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
