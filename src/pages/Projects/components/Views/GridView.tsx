import { Separator } from '@/components/ui/separator'
import ProjectCard from '../ProjectCard'

const GridView = ({
  inProgressProjects,
  draftProjects,
  completedProjects,
  handleClick,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: {
  inProgressProjects: any[]
  draftProjects: any[]
  completedProjects: any[]
  handleClick: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}) => {
  return (
    <>
      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>In Progress</h4>
        <div className='flex flex-row flex-wrap gap-4 py-4'>
          {inProgressProjects.length > 0 ? (
            inProgressProjects.map((project: any, index: any) => (
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
            <p>No projects in progress.</p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>Draft</h4>
        <div className='flex flex-row flex-wrap gap-4 py-4'>
          {draftProjects.length > 0 ? (
            draftProjects.map((project: any, index: any) => (
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
            <p>No draft projects.</p>
          )}
        </div>
      </div>

      <Separator className='my-4' />

      <div className='mt-4'>
        <h4 className='text-xl font-semibold'>Completed</h4>
        <div className='flex flex-row flex-wrap gap-4 py-4'>
          {completedProjects.length > 0 ? (
            completedProjects.map((project: any, index: any) => (
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
            <p>No completed projects.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default GridView
