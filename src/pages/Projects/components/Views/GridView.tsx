import ProjectCard from '../ProjectCard'
import { Separator } from '@/components/ui/separator'

type GridViewProps = {
  inProgressProjects: any[]
  draftProjects: any[]
  completedProjects: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}

type GridProps = {
  projects: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
  title: string
}

const Grid = ({
  projects,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
}: GridProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {projects.length > 0 ? (
          projects.map((project: any, index: any) => (
            <ProjectCard
              project={project}
              key={project.id}
              handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
              onConfirm={handleDeleteButtonClick}
              onEdit={handleEditButtonClick}
              index={index}
            />
          ))
        ) : (
          <p>No projects {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  inProgressProjects,
  draftProjects,
  completedProjects,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        projects={inProgressProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='In Progress'
      />

      <Separator className='my-4' />

      <Grid
        projects={draftProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Draft'
      />

      <Separator className='my-4' />

      <Grid
        projects={completedProjects}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Completed'
      />
    </>
  )
}

export default GridView
