import TemplateCard from '../SuperStructureCard'

type GridViewProps = {
  templates: any[]
  handleDeleteButtonClick: (template: any) => void
  handleEditButtonClick: (template: any) => void
  handleShowTemplateEditor: (template: any) => void
}

type GridProps = {
  templates: any[]
  handleDeleteButtonClick: (template: any) => void
  handleEditButtonClick: (template: any) => void
  handleShowTemplateEditor: (template: any) => void
  title: string
}

const Grid = ({
  templates,
  handleDeleteButtonClick,
  handleEditButtonClick,
  title,
  handleShowTemplateEditor,
}: GridProps) => {
  return (
    <div className='mt-4'>
      <h4 className='text-xl font-semibold'>{title}</h4>
      <div className='flex flex-row flex-wrap gap-4 py-4'>
        {templates.length > 0 ? (
          templates.map((template: any, index: any) => (
            <TemplateCard
              handleShowTemplateEditor={handleShowTemplateEditor}
              template={template}
              key={template.id}
              onConfirm={handleDeleteButtonClick}
              onEdit={handleEditButtonClick}
              index={index}
            />
          ))
        ) : (
          <p>No templates {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  )
}

const GridView = ({
  templates,
  handleDeleteButtonClick,
  handleEditButtonClick,
  handleShowTemplateEditor,
}: GridViewProps) => {
  return (
    <>
      <Grid
        templates={templates}
        handleDeleteButtonClick={handleDeleteButtonClick}
        handleEditButtonClick={handleEditButtonClick}
        title='Templates'
        handleShowTemplateEditor={handleShowTemplateEditor}
      />
    </>
  )
}

export default GridView
