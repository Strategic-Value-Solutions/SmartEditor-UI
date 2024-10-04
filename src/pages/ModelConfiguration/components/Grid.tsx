import ProjectCard from './ProjectCard'

type GridProps = {
  projects: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
  title: string
}

export default function Grid({
  projects,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
}: GridProps) {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {projects.length > 0 ? (
          projects.map((project: any, index: any) => (
            <ProjectCard
              project={project}
              key={project.id}
              handleRedirectToProjectModelScreen={
                handleRedirectToProjectModelScreen
              }
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
