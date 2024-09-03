import ActionButtons from './ActionButtons'
import StatusCapsule from '@/components/ui/status-capsule'
import { Document, Page } from 'react-pdf'

const ProjectModelCard = ({
  projectModel,
  handleSelectPick,
  handleRedirectToEditor,
  skipPick,
  completePick,
}: any) => {
  return (
    <div
      id='project-model-card'
      className={`relative border rounded-md p-2 w-56 ${
        projectModel.isActive
          ? 'border-blue-700 bg-blue-50 shadow-lg dark:border-white dark:bg-gray-800'
          : 'border-gray-300 bg-white dark:bg-gray-500 dark:border-gray-700'
      }`}
      style={{ marginBottom: '0.5rem' }} // Minimal bottom margin
    >
      {projectModel.isActive && (
        <div className='absolute top-0 right-0 rounded-tr-md rounded-bl-md bg-blue-700 text-white text-xs px-2 py-1 shadow-md dark:bg-gray-700'>
          Active
        </div>
      )}
      <div className={`flex justify-center items-center h-32 bg-gray-100`}>
        {projectModel.fileUrl ? (
          <div className='mb-1 text-gray-500 flex justify-center w-full items-center cursor-pointer'>
            <Document
              onClick={() => handleRedirectToEditor(projectModel)}
              file={projectModel.fileUrl}
              loading={<div>Loading thumbnail...</div>}
            >
              <Page
                pageNumber={1}
                width={80} // Smaller width
                height={16} // Smaller height
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className='max-w-full max-h-full object-contain'
              />
            </Document>
          </div>
        ) : (
          <div
            onClick={() => handleRedirectToEditor(projectModel)}
            className='text-center w-full flex justify-center items-center flex-col cursor-pointer'
          >
            <div className='mb-1 text-gray-500 flex justify-center w-full items-center text-sm'>
              No file available
            </div>
            <div className='h-16 w-16 bg-gray-300 rounded flex items-center justify-center'>
              <span className='text-gray-400 text-xs'>No PDF</span>
            </div>
          </div>
        )}
      </div>
      <h4 className='mt-1 text-base'>{projectModel?.pickModel?.name}</h4>

      <div className='mt-1 flex items-center justify-between gap-1'>
        <StatusCapsule
          status={projectModel.status}
          redirectTo={() => handleRedirectToEditor(projectModel)}
        />
        <ActionButtons
          projectModel={projectModel}
          onSelectPick={handleSelectPick}
          onCompletePick={completePick}
          onSkipPick={skipPick}
          showChildren={false}
        />
      </div>
    </div>
  )
}

export default ProjectModelCard
