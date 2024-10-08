import ReactQuillEditor from '@/components/custom/react-quill-editor'
import { Button } from '@/components/ui/button'
import templateApi from '@/service/templateApi'
import { updateTemplate } from '@/store/slices/templateSlice'
import { getErrorMessage } from '@/utils'
import he from 'he'
import { Pencil } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

// Available variables list with sample values
const variables = [
  {
    label: 'Annotation Data',
    value: 'annotationData',
    sample: `{
      "type": "Group",
      "version": "6.1.0",
      // ... (sample data truncated for brevity)
    }`,
  },
  {
    label: 'Custom Image',
    value: 'customImage',
    sample: '<img src="https://via.placeholder.com/150" alt="Custom Image" />',
  },
  { label: 'Created By Name', value: 'createdByName', sample: 'John Doe' },
  {
    label: 'Created By Email',
    value: 'createdByEmail',
    sample: 'john.doe@example.com',
  },
  { label: 'Status', value: 'status', sample: 'Pending' },
]

const wrapInCurlyBraces = (variable: string): string => {
  return `{{${variable}}}`
}

// Replace the variables in the content with sample data
const replaceVariablesWithSampleData = (content: string) => {
  let updatedContent = content
  variables.forEach(({ value, sample }) => {
    const regex = new RegExp(`{{${value}}}`, 'g') // match {{variable}}
    updatedContent = updatedContent.replace(regex, sample)
  })
  return updatedContent
}

const TemplateEditor = ({ template }: any) => {
  const [content, setContent] = useState(he.decode(template?.content || ''))
  const [previewContent, setPreviewContent] = useState('') // For live preview with replaced data
  const dispatch = useDispatch()

  // Function to update both content and preview
  const handleEditorChange = (value: string) => {
    setContent(value)
    const updatedContent = replaceVariablesWithSampleData(value)
    setPreviewContent(updatedContent)
  }

  const handleUpdateTemplate = async () => {
    try {
      const response = await templateApi.updateTemplate(template.id, {
        content,
      })
      dispatch(updateTemplate(response))
      toast.success('Template updated successfully')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  // Handle loading sample data into preview
  const handleLoadSampleData = () => {
    const updatedContent = replaceVariablesWithSampleData(content)
    setPreviewContent(updatedContent)
  }

  // Effect to update the preview initially with replaced variables
  useEffect(() => {
    const updatedContent = replaceVariablesWithSampleData(content)
    setPreviewContent(updatedContent)
  }, [])

  return (
    <div className='p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6'>
      {/* Left section with editor */}
      <div className='flex-1'>
        <div className='mb-6 flex items-center justify-between w-full'>
          <h1 className='text-2xl font-bold'>
            {template?.name || 'Untitled Template'}
          </h1>
          <Button
            onClick={handleUpdateTemplate}
            className='mt-4 flex h-8 items-center justify-center gap-2'
          >
            Update Template
            <Pencil size={14} />
          </Button>
        </div>

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
            Use these variables in your template content to insert dynamic
            values.
          </p>
        </div>

        {/* Load Sample Data Button */}
        <Button onClick={handleLoadSampleData} className='mb-4'>
          Load Sample Data
        </Button>

        {/* Quill Editor for Template Content */}
        <ReactQuillEditor
          value={content}
          onChange={handleEditorChange} // Handle content change here
          placeholder='Write your template content here...'
          className='min-h-96'
        />
      </div>

      {/* Right section for live preview */}
      <div className='flex-1 p-4 border rounded-md bg-white shadow-md'>
        <h2 className='font-semibold text-xl mb-4'>Live Preview</h2>
        {/* Preview of the content with replaced variables */}
        <div
          className=''
          dangerouslySetInnerHTML={{ __html: previewContent }} // Show previewContent if available
        />
      </div>
    </div>
  )
}

export default TemplateEditor
