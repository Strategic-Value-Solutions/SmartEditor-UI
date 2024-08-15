// @ts-nocheck
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import NewTemplate from './components/Dialog/NewTemplate'
import Header from './components/Header'
import TemplateCard from './components/TemplateCard'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { RootState } from '@/store'
import { deleteConfig } from '@/store/slices/configurationSlice'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'

const Templates = () => {
  const [openTemplateModal, setOpenTemplateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [viewType, setViewType] = useState('grid')
  const [isEdit, setIsEdit] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredConfigs, setFilteredConfigs] = useState([])
  const configsData = useSelector(
    (state: RootState) => state.configurations.configsData || []
  )
  const dispatch = useDispatch()

  const handleEditButtonClick = (template) => {
    setSelectedTemplate(template)
    setIsEdit(true)
    setOpenTemplateModal(true)
  }

  const handleDeleteButtonClick = (template) => {
    setSelectedTemplate(template)
    setOpenDeleteModal(true)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedTemplate(null)
  }

  const onConfirm = () => {
    if (!selectedTemplate?.id) {
      toast.error('Please select a template to delete')
      return
    }
    dispatch(deleteConfig(selectedTemplate.id))
    handleDeleteModalClose()
  }

  const onHandleAddTemplate = () => {
    setSelectedTemplate(null) // Clear selected template
    setIsEdit(false) // Set to create mode
    setOpenTemplateModal(true)
  }

  const handleCloseTemplateModal = () => {
    setOpenTemplateModal(false)
    setSelectedTemplate(null) // Clear the selected template when modal is closed
    setIsEdit(false) // Reset edit mode
  }

  useEffect(() => {
    setFilteredConfigs(configsData)
  }, [configsData])

  useEffect(() => {
    if (search === '') {
      setFilteredConfigs(configsData)
    } else {
      const filtered = configsData.filter((config: any) => {
        return config.modelName.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredConfigs(filtered)
    }
  }, [search])

  return (
    <div className='flex flex-col'>
      <h3 className='flex h-8 flex-col pb-1 text-2xl'>Templates</h3>
      <Header
        viewType={viewType}
        setViewType={setViewType}
        onHandleAddTemplate={onHandleAddTemplate}
        setSearch={setSearch}
        search={search}
      />
      {viewType === 'grid' ? (
        <div className='mt-4 inline-flex flex-row flex-wrap gap-2 overflow-hidden'>
          {filteredConfigs.map((config: any) => (
            <TemplateCard
              configuration={config}
              key={config.id}
              onEdit={() => handleEditButtonClick(config)}
              onConfirm={() => handleDeleteButtonClick(config)}
            />
          ))}
        </div>
      ) : (
        <div className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConfigs.map((config: any) => (
                <TableRow key={config.id}>
                  <TableCell>{config.modelName}</TableCell>
                  <TableCell className='flex items-center justify-end gap-2'>
                    <Button
                      variant='outline'
                      className='h-6 rounded p-1'
                      onClick={() => handleEditButtonClick(config)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteButtonClick(config)}
                      variant='destructive'
                      className='h-6 rounded bg-red-400 p-1'
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* New/Edit Template Modal */}
      <NewTemplate
        open={openTemplateModal}
        onClose={handleCloseTemplateModal}
        isEdit={isEdit}
        selectedConfig={selectedTemplate}
        setOpen={setOpenTemplateModal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        title='Delete Template'
        message='Are you sure you want to delete this template?'
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={onConfirm}
      />
    </div>
  )
}

export default Templates
