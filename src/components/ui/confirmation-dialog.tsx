import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React from 'react'

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  trigger?: React.ReactNode
  title?: string
  message?: string
  children?: React.ReactElement
  showCancelButton?: boolean
  confirmButtonText?: string
  showChildren?: boolean
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  trigger,
  title,
  message,
  children = <></>,
  showCancelButton = true,
  confirmButtonText = 'Confirm',
  showChildren = true,
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{message}</DialogDescription>
        <DialogFooter>
          {showChildren && children}
          {showCancelButton && <Button onClick={onClose}>Cancel</Button>}
          <Button
            onClick={onConfirm}
            color='destructive'
            className='bg-red-500'
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
