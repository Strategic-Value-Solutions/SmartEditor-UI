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

const TemplateEditor = ({ template }: any) => {
  // Decode the content to handle any HTML entity issues
  const [content, setContent] = useState(he.decode(template?.content || ''))
  const dispatch = useDispatch()

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
