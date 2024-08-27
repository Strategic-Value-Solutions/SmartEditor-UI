import StatusCapsule from '@/components/ui/status-capsule'
import { Document, Page } from 'react-pdf'
import ActionButtons from './ActionButtons'

const ProjectModelCard = ({
  projectModel,
  handleSelectPick,
  handleRedirectToEditor,
  skipPick,
  completePick,
}: any) => {
  return (
    <div
      className={`relative border rounded-lg p-4 ${
        projectModel.isActive
          ? 'border-blue-500 border-2 '
          : 'border-gray-300'
      }`}
    >
      {projectModel.isActive && (
        <div className='absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg'>
          Active
        </div>
      )}
      <div
        className={`flex justify-center items-center h-40 ${projectModel?.fileUrl ? '' : 'bg-gray-100'}`}
      >
        {projectModel.fileUrl ? (
          <div className='mb-2 text-gray-500 flex justify-center w-full items-center cursor-pointer'>
            <Document
              onClick={() => handleRedirectToEditor(projectModel)}
              file={projectModel.fileUrl}
              loading={<div>Loading thumbnail...</div>}
            >
              <Page
                pageNumber={1}
                width={100} // Set a fixed width
                height={20} // Set a fixed height
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
            <div className='mb-2 text-gray-500 flex justify-center w-full items-center'>
              No file available
            </div>
            <div className='h-20 w-20 bg-gray-300 rounded flex items-center justify-center'>
              <span className='text-gray-400 text-sm'>No PDF</span>
            </div>
          </div>
        )}
      </div>
      <h4 className='mt-2 text-lg'>{projectModel?.pickModel?.name}</h4>

      <div className='mt-2 flex items-center justify-between gap-2'>
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
