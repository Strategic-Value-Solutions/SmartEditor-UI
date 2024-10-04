import ModelConfigurationCard from '../ModelConfigurationCard'
import { Separator } from '@/components/ui/separator'

type GridViewProps = {
  configurations: any[]
  handleRedirectToModelScreen: (config: any) => void
  handleDeleteButtonClick: (config: any) => void
  handleEditButtonClick: (config: any) => void
}

type GridProps = {
  configurations: any[]
  handleRedirectToModelScreen: (config: any) => void
  handleDeleteButtonClick: (config: any) => void
  handleEditButtonClick: (config: any) => void
}

const Grid = ({
  configurations,
  handleRedirectToModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridProps) => {
  
  return (
    <div className='mt-4'>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {configurations.length > 0 ? (
          configurations.map((config: any, index: any) => (
            <ModelConfigurationCard
              configuration={config}
              key={config.id}
              handleRedirectToModelScreen={handleRedirectToModelScreen}
              onConfirm={handleDeleteButtonClick}
              onEdit={handleEditButtonClick}
              index={index}
            />
          ))
        ) : (
          <p>No configurations found.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  configurations,
  handleRedirectToModelScreen,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        configurations={configurations}
        handleRedirectToModelScreen={handleRedirectToModelScreen}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
      />
    </>
  )
}

export default GridView
