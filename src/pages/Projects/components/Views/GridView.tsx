import ProjectCard from '../ProjectCard'
import { Separator } from '@/components/ui/separator'

type GridViewProps = {
  inProgressProjects: any[]
  draftProjects: any[]
  completedProjects: any[]
  handleClick: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}

type GridProps = {
  projects: any[]
  handleClick: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
  title: string
}

const Grid = ({
  projects,
  handleClick,
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
              handleClick={handleClick}
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
  handleClick,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        projects={inProgressProjects}
        handleClick={handleClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='In Progress'
      />

      <Separator className='my-4' />

      <Grid
        projects={draftProjects}
        handleClick={handleClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Draft'
      />

      <Separator className='my-4' />

      <Grid
        projects={completedProjects}
        handleClick={handleClick}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Completed'
      />
    </>
  )
}

export default GridView
