//@ts-nocheck
import NewModelConfiguration from './components/Dialog/NewModelConfiguration'
import Header from './components/Header'
import GridView from './components/Views/GridView'
import ListView from './components/Views/ListView'
import Loader from '@/components/ui/Loader'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Separator } from '@/components/ui/separator'
import imageConstants from '@/constants/imageConstants'
import modelConfigurationApi from '@/service/modelConfigurationApi'
import superStructureApi from '@/service/superStructureApi'
import { RootState } from '@/store'
import {
  deleteModelConfiguration,
  setCurrentModelConfiguration,
  setModelConfigurationsData,
} from '@/store/slices/modelConfigurationSlice'
import { setSuperStructureData } from '@/store/slices/superStructureSlice'
import { getErrorMessage } from '@/utils'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ModelConfigurations = () => {
  const modelConfigurationsData = useSelector(
    (state: RootState) => state.modelConfiguration.modelConfigurationsData || []
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const [filteredModelConfigurations, setFilteredModelConfigurations] =
    useState([])
  const [sharedModelConfigurations, setSharedModelConfigurations] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedModelConfiguration, setSelectedModelConfiguration] =
    useState<any>(null)
  const [openModelConfigurationModal, setOpenModelConfigurationModal] =
    useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEditButtonClick = (modelConfiguration: any) => {
    setSelectedModelConfiguration(modelConfiguration)
    setIsEdit(true)
    setOpenModelConfigurationModal(true)
  }

  const handleDeleteButtonClick = (modelConfiguration: any) => {
    setSelectedModelConfiguration(modelConfiguration)
    setOpenDeleteModal(true)
  }

  const handleRedirectToModelConfigurationModelScreen = (
    modelConfiguration: any
  ) => {
    dispatch(setCurrentModelConfiguration(modelConfiguration))
    navigate(`/modelConfiguration/${modelConfiguration.id}`)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedModelConfiguration(null)
  }

  const onConfirm = async () => {
    if (!selectedModelConfiguration?.id) {
      toast.error('Please select a modelConfiguration to delete')
      return
    }
    try {
      setLoading(true)
      await modelConfigurationApi.deleteModel(selectedModelConfiguration.id)
      dispatch(deleteModelConfiguration(selectedModelConfiguration.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddModelConfiguration = () => {
    setSelectedModelConfiguration(null)
    setIsEdit(false)
    setOpenModelConfigurationModal(true)
  }

  const handleCloseModelConfigurationModal = () => {
    setOpenModelConfigurationModal(false)
    setSelectedModelConfiguration(null)
    setIsEdit(false)
  }

  useEffect(() => {
    if (search === '') {
      setFilteredModelConfigurations(modelConfigurationsData)
    } else {
      const filtered = modelConfigurationsData.filter(
        (modelConfiguration: any) => {
          return modelConfiguration.name
            .toLowerCase()
            .includes(search.toLowerCase())
        }
      )
      setFilteredModelConfigurations(filtered)
    }
  }, [search])

  useEffect(() => {
    const fetchSuperStructures = async () => {
      try {
        setLoading(true)
        const response = await superStructureApi.getSuperStructures()

        dispatch(setSuperStructureData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchSuperStructures()
  }, [])

  useEffect(() => {
    const fetchModelConfigurations = async () => {
      try {
        setLoading(true)
        const response = await Promise.all([modelConfigurationApi.getModels()])
        setSharedModelConfigurations(response[0])
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchModelConfigurations()
  }, [])

  useEffect(() => {
    const fetchModelConfigurations = async () => {
      try {
        setLoading(true)
        const response = await modelConfigurationApi.getModels()

        dispatch(setModelConfigurationsData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchModelConfigurations()
  }, [])

  useEffect(() => {
    setFilteredModelConfigurations(modelConfigurationsData)
  }, [modelConfigurationsData])

  const renderMainContent = () => {
    if (
      modelConfigurationsData.length === 0 &&
      sharedModelConfigurations.length === 0
    ) {
      return (
        <div className='flex flex-col items-center justify-center h-[75vh]'>
          <div className='w-full md:w-1/2'>
            <img
              src={imageConstants.noData}
              alt='No modelConfigurations illustration'
              className='mx-auto md:ml-auto lg:max-w-[200px] w-full'
            />
          </div>
          <div className='text-center md:text-left mt-6 md:mb-0 flex flex-col items-center md:w-1/2'>
            <h3 className='text-2xl'>No Model Configurations there</h3>
            <p className='text-sm text-gray-600'>
              You haven’t created any modelConfigurations. Start by creating
              your first model Configuration.
            </p>
          </div>
        </div>
      )
    } else {
      return viewType === 'grid' ? (
        <GridView
          configurations={filteredModelConfigurations}
          handleRedirectToModelConfigurationModelScreen={
            handleRedirectToModelConfigurationModelScreen
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ) : (
        <ListView
          configurations={filteredModelConfigurations}
          handleRedirectToModelConfigurationModelScreen={
            handleRedirectToModelConfigurationModelScreen
          }
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      )
    }
  }

  if (loading) return <Loader />

  return (
    <div className='flex flex-col'>
      <h3 className='flex h-8 flex-col pb-1 text-2xl'>Model Configurations</h3>
      <Header
        setViewType={setViewType}
        viewType={viewType}
        onHandleAddModelConfiguration={onHandleAddModelConfiguration}
        setSearch={setSearch}
        search={search}
      />

      <Separator className='my-4' />
      {renderMainContent()}
      <ConfirmationDialog
        title='Delete Model Configuration'
        message='Are you sure you want to delete this model configuration?'
        open={openDeleteModal}
        onClose={handleDeleteModalClose}
        onConfirm={onConfirm}
      />
      <NewModelConfiguration
        open={openModelConfigurationModal}
        onClose={handleCloseModelConfigurationModal}
        isEdit={isEdit}
        setFilteredModelConfigurations={setFilteredModelConfigurations}
        selectedModelConfiguration={selectedModelConfiguration}
        setOpen={setOpenModelConfigurationModal}
      />
    </div>
  )
}

export default ModelConfigurations
