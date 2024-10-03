import ReactQuillEditor from '@/components/custom/react-quill-editor'
import { Button } from '@/components/ui/button'
import templateApi from '@/service/templateApi'
import { updateTemplate } from '@/store/slices/templateSlice'
import { getErrorMessage } from '@/utils'
import he from 'he'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

// Available variables list
const variables = [
  { label: 'Annotation Data', value: 'annotationData' },
  { label: 'Custom Image', value: 'customImage' },
  { label: 'Created By Name', value: 'createdByName' },
  { label: 'Created By Email', value: 'createdByEmail' },
  { label: 'Status', value: 'status' },
]

const wrapInCurlyBraces = (variable: string): string => {
  return `{{${variable}}}`
}

const TemplateEditor = ({ template, jsonData }: any) => {
  // Decode the content to handle any HTML entity issues
  const [content, setContent] = useState(he.decode(template?.content || ''))
  const dispatch = useDispatch()

  const handleUpdateTemplate = async () => {
    try {
      // Replace variables before sending the updated content

      const response = await templateApi.updateTemplate(template.id, {
        content,
      })

      dispatch(updateTemplate(response))
      toast.success('Template updated successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className='p-4'>
      {/* Template Information */}
      <div className='mb-6 flex items-center justify-between w-full'>
        <h1 className='text-2xl font-bold'>
          {template?.name || 'Untitled Template'}
        </h1>
        <Button
          onClick={handleUpdateTemplate}
          className='mt-4 flex h-8 items-center justify-center'
        >
          Update Template
          <Pencil size={20} />
        </Button>
      </div>

      {/* Template Description */}
      {template?.description && (
        <p className='mb-4 text-lg text-gray-700'>{template.description}</p>
      )}

      {/* Instructions for using variables */}
      <div className='mb-4 p-4 bg-gray-100 rounded-md'>
        <h2 className='font-semibold mb-2'>Available Variables:</h2>
        <ul className='list-disc ml-4 text-sm'>
          {variables.map((variable, index) => (
            <li key={index}>
              {wrapInCurlyBraces(variable.value)}: {variable.label}
            </li>
          ))}
        </ul>

        <p className='text-xs mt-2 text-gray-600'>
          Use these variables in your template content to insert dynamic values.
        </p>
      </div>

      {/* Quill Editor for Template Content */}
      <ReactQuillEditor
        value={content}
        onChange={(value) => setContent(value)} // Handle content change here
        placeholder='Write your template content here...'
        className='min-h-96'
      />
    </div>
  )
}

export default TemplateEditor
