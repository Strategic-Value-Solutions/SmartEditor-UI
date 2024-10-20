import SuperStructureCard from '../SuperStructureCard'

type GridViewProps = {
  superStructures: any[]
  handleDeleteButtonClick: (superStructure: any) => void
  handleEditButtonClick: (superStructure: any) => void
  handleCardClick: (superStructure: any) => void
}

type GridProps = {
  superStructures: any[]
  handleDeleteButtonClick: (superStructure: any) => void
  handleEditButtonClick: (superStructure: any) => void
  title: string
  handleCardClick: (superStructure: any) => void
}

const Grid = ({
  superStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
  handleCardClick,
}: GridProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {superStructures.length > 0 ? (
          superStructures.map((superStructure: any, index: any) => (
            <SuperStructureCard
              handleCardClick={handleCardClick}
              superStructure={superStructure}
              key={superStructure.id}
              onConfirm={handleDeleteButtonClick}
              onEdit={handleEditButtonClick}
              index={index}
            />
          ))
        ) : (
          <p>No superStructures {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  superStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleCardClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        handleCardClick={handleCardClick}
        superStructures={superStructures}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Super structures'
      />
    </>
  )
}

export default GridView
