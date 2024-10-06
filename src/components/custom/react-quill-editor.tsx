import he from 'he'
import QuillDragAndDropModule from 'quill-drag-and-drop-module'
import ImageResize from 'quill-image-resize-module-react'
import { forwardRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface ReactQuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

// Register the image resize and drag-and-drop modules
ReactQuill.Quill.register('modules/imageResize', ImageResize)

const ReactQuillEditor = forwardRef<any, ReactQuillEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    return (
      <ReactQuill
        ref={ref}
        theme='snow'
        value={he.decode(value)}
        onChange={(value) => onChange(value)}
        modules={{
          toolbar: [
            // Consolidated header dropdown to prevent multiple "normal" options
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['image', 'video', 'link'],
          ],
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
        }}
        placeholder={placeholder}
        className={className ? className : 'rounded-md border border-gray-300'}
      />
    )
  }
)

// Set displayName for better debugging
ReactQuillEditor.displayName = 'ReactQuillEditor'

export default ReactQuillEditor
