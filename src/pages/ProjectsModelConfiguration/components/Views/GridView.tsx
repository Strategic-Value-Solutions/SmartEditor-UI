import ProjectCard from '../ModelConfigurationCard'

type GridViewProps = {
  configurations: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
}

type GridProps = {
  configurations: any[]
  handleRedirectToProjectModelScreen: (project: any) => void
  handleDeleteButtonClick: (project: any) => void
  handleEditButtonClick: (project: any) => void
  title: string
}

const Grid = ({
  configurations,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
}: GridProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {configurations.length > 0 ? (
          configurations.map((project: any, index: any) => (
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
          <p>No configurations {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  configurations,
  handleRedirectToProjectModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        configurations={configurations}
        handleRedirectToProjectModelScreen={handleRedirectToProjectModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Project Model Configuration'
      />

   
    </>
  )
}

export default GridView
