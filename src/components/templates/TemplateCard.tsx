import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { Package } from 'lucide-react'
import { useContext, useState } from 'react'
import { ProjectDataContext } from '../../store/ProjectDataContext' // Ensure the path is correct
import { Card } from '../ui/card'

const TemplateCard = ({ id, title }: any) => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const { configsData, setConfigsData } = useContext(ProjectDataContext)

  const handleEditModalOpen = () => setOpenEditModal(true)
  const handleEditModalClose = () => setOpenEditModal(false)
  const handleDeleteModalOpen = () => setOpenDeleteModal(true)
  const handleDeleteModalClose = () => setOpenDeleteModal(false)

  const handleDelete = () => {
    // Filter out the configuration that needs to be deleted
    const updatedConfigs = configsData.filter((config: any) => config.id !== id)
    setConfigsData(updatedConfigs)
    console.log('Template deleted successfully')
    handleDeleteModalClose()
  }

  return (
    <>
      <Card className='m-2 w-52'>
        <div className='flex  cursor-pointer flex-col rounded-lg bg-white  p-4'>
          <div className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-gray-200'>
            <Package className='text-9xl text-white' size={50} />
          </div>
          <div className='flex-grow px-2 pt-2 text-left font-light'>
            {title}
          </div>
        </div>
      </Card>

      {/* Edit Modal */}
      <Dialog open={openEditModal} onClose={handleEditModalClose}>
        <DialogTitle>Edit Template</DialogTitle>
        <DialogContent>{/* Form components here */}</DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button onClick={handleEditModalClose} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openDeleteModal} onClose={handleDeleteModalClose}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this template?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteModalClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TemplateCard
