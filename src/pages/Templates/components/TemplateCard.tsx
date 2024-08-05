import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProjectDataContext } from '@/store/ProjectDataContext'
import { Package, Pencil, Trash2 } from 'lucide-react'
import { useContext, useState } from 'react'
import DeleteTemplate from './Dialog/DeleteTemplate'
import NewTemplate from './Dialog/NewTemplate'

const TemplateCard = ({ id, title }: any) => {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const { configsData, setConfigsData } = useContext(ProjectDataContext)

  const handleDeleteModal = () => setOpenDeleteModal(!openDeleteModal)
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
          <div className='flex h-36 items-center justify-center overflow-hidden rounded-md bg-[#8892b3]'>
            <Package className='text-9xl text-white' size={50} />
          </div>
          <div className='flex justify-between pt-2'>
            <div className='flex-grow text-left font-light'>{title}</div>
            <div className='flex justify-between gap-1'>
              <NewTemplate
                isEdit
                trigger={
                  <Button variant='outline' className='h-6 rounded p-1'>
                    <Pencil size={15} />
                  </Button>
                }
              />

              <DeleteTemplate
                onDelete={handleDelete}
                onClose={handleDeleteModal}
                trigger={
                  <Button
                    onClick={handleDeleteModal}
                    variant='destructive'
                    className='h-6 rounded bg-red-400 p-1'
                  >
                    <Trash2 size={15} />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}

export default TemplateCard
