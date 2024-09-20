import { useEditor } from './CanvasContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const AnnotationModal = ({ children }) => {
  const editor = useEditor()
  const [status, setStatus] = useState(
    editor?.selectedAnnotation?.status || 'new'
  )

  // Function to handle status change and close the modal
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    // Update the status of the selected annotation
    if (editor.selectedAnnotation?._id) {
      editor.changeAnnotationStatusById(
        editor.selectedAnnotation._id,
        newStatus
      )
    }
  }

  useEffect(() => {
    setStatus(editor?.selectedAnnotation?.status || 'new')
  }, [editor.selectedAnnotation])

  return (
    <div>
      {/* The Dialog component */}
      <Dialog
        open={editor.showAnnotationModal}
        onOpenChange={editor.setShowAnnotationModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Annotation Status</DialogTitle>
            <DialogDescription>
              You can change the status of the selected annotation here.
            </DialogDescription>
          </DialogHeader>

          {/* Dropdown for Changing Status */}
          <div className='status-section'>
            <p>Current Status: {status}</p>

            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder='Select a status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='new'>New</SelectItem>
                <SelectItem value='in progress'>In Progress</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Any additional content */}
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}

AnnotationModal.propTypes = {
  children: PropTypes.node,
}

export default AnnotationModal
