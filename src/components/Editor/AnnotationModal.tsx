//@ts-nocheck
import { useEditor } from './CanvasContext/CanvasContext'
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
    editor?.selectedAnnotation?.status || 'Pending'
  )

  // Debugging log
  // Function to handle status change, update annotation color, and close the modal
  const handleStatusChange = (newStatus) => {
    // Debugging log
    setStatus(newStatus)

    // Update the status of the selected annotation
    if (editor.selectedAnnotation?.id) {
      editor.changeAnnotationStatusById(
        editor.selectedAnnotation.id,
        newStatus,
        editor.currPage
      )

      // Close the modal after status is changed
      editor.setShowAnnotationModal(false)
    } else {
      console.error('No annotation selected or invalid editor state')
    }
  }

  useEffect(() => {
    // Debugging log
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
                <SelectItem value='Pending'>Pending</SelectItem>
                <SelectItem value='Working'>Working</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
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
