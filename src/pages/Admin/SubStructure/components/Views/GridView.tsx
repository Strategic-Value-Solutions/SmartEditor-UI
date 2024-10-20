import SubStructureCard from '../SubStructureCard'

type GridViewProps = {
  subStructures: any[]
  handleDeleteButtonClick: (subStructure: any) => void
  handleEditButtonClick: (subStructure: any) => void
}

type GridProps = {
  subStructures: any[]
  handleDeleteButtonClick: (subStructure: any) => void
  handleEditButtonClick: (subStructure: any) => void
  title: string
}

const Grid = ({
  subStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
}: GridProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {subStructures.length > 0 ? (
          subStructures.map((subStructure: any, index: any) => (
            <SubStructureCard
              subStructure={subStructure}
              key={subStructure.id}
              onConfirm={handleDeleteButtonClick}
              onEdit={handleEditButtonClick}
              index={index}
            />
          ))
        ) : (
          <p>No subStructures {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  subStructures,
  handleDeleteButtonClick,
  handleEditButtonClick,
}: GridViewProps) => {
  return (
    <>
      <Grid
        subStructures={subStructures}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Sub structures'
      />
    </>
  )
}

export default GridView
