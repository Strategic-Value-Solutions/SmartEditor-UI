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
ReactQuill.Quill.register('modules/dragAndDrop', QuillDragAndDropModule)

const ReactQuillEditor = forwardRef<any, ReactQuillEditorProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    return (
      <ReactQuill
        ref={ref}
        theme='snow'
        value={value}
        onChange={(value) => onChange(value)}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'code-block'],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['image', 'video', 'link'],
          ],
          imageResize: {
            // Options for the image resize module
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
          dragAndDrop: {
            draggables: [
              {
                content_type_pattern: /^image\/(jpeg|png|gif)$/, // Allows dragging image content types
                tag: 'img', // HTML tag for the draggable element
                attr: 'src', // Attribute to check or set for dragging
              },
              {
                content_type_pattern: /^video\/(mp4|webm|ogg)$/, // Allows dragging video content types
                tag: 'video', // HTML tag for the draggable element
                attr: 'src', // Attribute to check or set for dragging
              },
            ],
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
