import ActionButtons from './ActionButtons'
import StatusCapsule from '@/components/ui/status-capsule'
import { Document, Page } from 'react-pdf'
import { toast } from 'sonner'

const ProjectModelCard = ({
  projectModel,
  handleSelectPick,
  handleRedirectToEditor,
  skipPick,
  completePick,
}: any) => {
  return (
    <div
      className={`border rounded-lg p-4 ${
        projectModel.isActive ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <div className='flex justify-center items-center h-40 bg-gray-100'>
        {projectModel.fileUrl ? (
          <div className='mb-2 text-gray-500 flex justify-center w-full items-center cursor-pointer'>
            <Document
              onClick={() => handleRedirectToEditor(projectModel)}
              file={projectModel.fileUrl}
              loading={<div>Loading thumbnail...</div>}
            >
              <Page
                pageNumber={1}
                width={100}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        ) : (
          <div
            onClick={() => handleRedirectToEditor(projectModel)}
            className='text-center w-full flex justify-center items-center flex-col cursor-pointer'
            // onClick={() => toast.error('Please upload a file')}
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
        />
      </div>
    </div>
  )
}

export default ProjectModelCard
