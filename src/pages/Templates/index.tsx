//@ts-nocheck
import NewTemplate from './components/Dialog/NewTemplate'
import Header from './components/Header'
import TemplateEditor from './components/TemplateEditor'
import GridView from './components/Views/GridView'
import ListView from './components/Views/ListView'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Separator } from '@/components/ui/separator'
import imageConstants from '@/constants/imageConstants'
import templateApi from '@/service/templateApi'
import { RootState } from '@/store'
import { deleteTemplate, setTemplatesData } from '@/store/slices/templateSlice'
import { getErrorMessage } from '@/utils'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Templates = () => {
  const templatesData = useSelector(
    (state: RootState) => state.template.templatesData || []
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [openTemplateModal, setOpenTemplateModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const isTemplateTourCompleted =
    localStorage.getItem('templateTourCompleted')?.toString() === 'true'
  const handleEditButtonClick = (template: any) => {
    setSelectedTemplate(template)
    setIsEdit(true)
    setOpenTemplateModal(true)
  }

  const handleDeleteButtonClick = (template: any) => {
    setSelectedTemplate(template)
    setOpenDeleteModal(true)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedTemplate(null)
  }

  const onConfirm = async () => {
    if (!selectedTemplate?.id) {
      toast.error('Please select a template to delete')
      return
    }
    try {
      setLoading(true)
      await templateApi.deleteTemplate(selectedTemplate.id)

      dispatch(deleteTemplate(selectedTemplate.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddTemplate = () => {
    setSelectedTemplate(null)
    setIsEdit(false)
    setOpenTemplateModal(true)
  }

  const handleCloseTemplateModal = () => {
    setOpenTemplateModal(false)
    setSelectedTemplate(null)
    setIsEdit(false)
  }

  useEffect(() => {
    if (search === '') {
      setFilteredTemplates(templatesData)
    } else {
      const filtered = templatesData.filter((template: any) => {
        return template.name.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredTemplates(filtered)
    }
  }, [search])

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await templateApi.getTemplates()
        dispatch(setTemplatesData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  useEffect(() => {
    setFilteredTemplates(templatesData)
  }, [templatesData])

  const handleShowTemplateEditor = (template: any) => {
    setSelectedTemplate(template)
    setShowTemplateEditor(true)
  }

  const handleBack = () => {
    setShowTemplateEditor(false)
    setSelectedTemplate(null)
  }

  const renderMainContent = () => {
    if (templatesData.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-[75vh]'>
          <div className='w-full md:w-1/2'>
            <img
              src={imageConstants.noData}
              alt='No templates illustration'
              className='mx-auto md:ml-auto lg:max-w-[200px] w-full'
            />
          </div>
          <div className='text-center md:text-left mt-6 md:mb-0 flex flex-col items-center md:w-1/2'>
            <h3 className='text-2xl'>No Templates there</h3>
            <p className='text-sm text-gray-600'>
              You haven’t created any templates. Start by creating your first
              template.
            </p>
          </div>
        </div>
      )
    } else {
      return viewType === 'grid' ? (
        <GridView
          handleShowTemplateEditor={handleShowTemplateEditor}
          templates={templatesData}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ) : (
        <ListView
          handleShowTemplateEditor={handleShowTemplateEditor}
          templates={templatesData}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      )
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <div className='flex w-full justify-between'>
        <h3 className='flex h-8 flex-col pb-1 text-2xl'>Templates</h3>
        {showTemplateEditor && (
          <div className='mb-4'>
            <Button onClick={handleBack} className='flex items-center h-8'>
              <ArrowLeft className='mr-2' size={16} />
              Back
            </Button>
          </div>
        )}
      </div>
      {showTemplateEditor ? (
        <TemplateEditor template={selectedTemplate} handleBack={handleBack} />
      ) : (
        <>
          <Header
            setViewType={setViewType}
            viewType={viewType}
            onHandleAddTemplate={onHandleAddTemplate}
            setSearch={setSearch}
            search={search}
          />

          <Separator className='my-4' />
          {renderMainContent()}
          <ConfirmationDialog
            title='Delete Template'
            message='Are you sure you want to delete this template?'
            open={openDeleteModal}
            onClose={handleDeleteModalClose}
            onConfirm={onConfirm}
          />
          <NewTemplate
            open={openTemplateModal}
            onClose={handleCloseTemplateModal}
            isEdit={isEdit}
            setFilteredTemplates={setFilteredTemplates}
            selectedTemplate={selectedTemplate}
            setOpen={setOpenTemplateModal}
          />
        </>
      )}
    </div>
  )
}

export default Templates
