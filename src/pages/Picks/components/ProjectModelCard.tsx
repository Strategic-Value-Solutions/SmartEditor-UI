import { formatText, getStatusDotColor, getStatusStyles } from '@/utils'
import { Ban, Check, Pencil, Trash2 } from 'lucide-react'
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
              onClick={() => handleRedirectToEditor(projectModel)} // file={projectModel.fileUrl}
              file={'https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK'}
              loading={<div>Loading thumbnail...</div>}
            >
              <Page
                pageNumber={1}
                width={100} // Adjust the width as needed
                renderTextLayer={false} // Disable text layer for a cleaner thumbnail
                renderAnnotationLayer={false} // Disable annotation layer for a cleaner thumbnail
              />
            </Document>
          </div>
        ) : (
          <div
            className='text-center w-full flex justify-center items-center flex-col cursor-pointer'
            onClick={() => toast.error('Please upload a file')}
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

      <div className='mt-2 flex items-center justify-between gap-2 '>
        <span
          className={`text-sm flex items-center justify-center p-1 rounded-full ${getStatusStyles(
            projectModel.status
          )}`}
          style={{
            height: '24px',
            padding: '0 8px',
          }}
        >
          {formatText(projectModel.status)}
          <span
            className={`ml-2 w-2 h-2 rounded-full ${getStatusDotColor(
              projectModel.status
            )}`}
          ></span>
        </span>
        <div>
          <button
            className={`h-6 rounded p-1 text-green-400 ${
              projectModel.isActive ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => projectModel.isActive && completePick(projectModel)}
            disabled={!projectModel.isActive}
          >
            <Check size={20} />
          </button>
          <button
            className={`h-6 rounded p-1 text-red-400 ${
              projectModel.isActive ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => projectModel.isActive && skipPick(projectModel)}
            disabled={!projectModel.isActive}
          >
            <Ban size={15} />
          </button>
          <button
            className={`h-6 rounded p-1 ${
              projectModel.isActive ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() =>
              projectModel.isActive && handleSelectPick(projectModel)
            }
            disabled={!projectModel.isActive}
          >
            <Pencil size={15} />
          </button>
          <button
            className='h-6 rounded bg-red-400 p-1 text-white'
            onClick={() => toast.error('Not implemented yet')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectModelCard
