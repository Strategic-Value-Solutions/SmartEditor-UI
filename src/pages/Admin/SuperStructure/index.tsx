//@ts-nocheck
import NewSuperStructure from './components/Dialog/NewSuperStructure'
import Header from './components/Header'
import SuperStructureEditor from './components/SuperStructureEditor'
import GridView from './components/Views/GridView'
import ListView from './components/Views/ListView'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Separator } from '@/components/ui/separator'
import imageConstants from '@/constants/imageConstants'
import superStructureApi from '@/service/superStructureApi'
import { RootState } from '@/store'
import {
  deleteSuperStructure,
  setSuperStructureData,
} from '@/store/slices/superStructureSlice'
import { getErrorMessage } from '@/utils'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const SuperStructures = () => {
  const superStructuresData = useSelector(
    (state: RootState) => state.superStructure.superStructuresData || []
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const [filteredSuperStructures, setFilteredSuperStructures] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedSuperStructure, setSelectedSuperStructure] =
    useState<any>(null)
  const [showSuperStructureEditor, setShowSuperStructureEditor] =
    useState(false)
  const [openSuperStructureModal, setOpenSuperStructureModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSuperStructureTourCompleted =
    localStorage.getItem('superStructureTourCompleted')?.toString() === 'true'
  const handleEditButtonClick = (superStructure: any) => {
    setSelectedSuperStructure(superStructure)
    setIsEdit(true)
    setOpenSuperStructureModal(true)
  }

  const handleDeleteButtonClick = (superStructure: any) => {
    setSelectedSuperStructure(superStructure)
    setOpenDeleteModal(true)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedSuperStructure(null)
  }

  const onConfirm = async () => {
    if (!selectedSuperStructure?.id) {
      toast.error('Please select a superStructure to delete')
      return
    }
    try {
      setLoading(true)
      await superStructureApi.deleteSuperStructure(selectedSuperStructure.id)

      dispatch(deleteSuperStructure(selectedSuperStructure.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddSuperStructure = () => {
    setSelectedSuperStructure(null)
    setIsEdit(false)
    setOpenSuperStructureModal(true)
  }

  const handleCloseSuperStructureModal = () => {
    setOpenSuperStructureModal(false)
    setSelectedSuperStructure(null)
    setIsEdit(false)
  }

  useEffect(() => {
    if (search === '') {
      setFilteredSuperStructures(superStructuresData)
    } else {
      const filtered = superStructuresData.filter((superStructure: any) => {
        return superStructure.name.toLowerCase().includes(search.toLowerCase())
      })
      setFilteredSuperStructures(filtered)
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
    setFilteredSuperStructures(superStructuresData)
  }, [superStructuresData])

  const handleShowSuperStructureEditor = (superStructure: any) => {
    setSelectedSuperStructure(superStructure)
    setShowSuperStructureEditor(true)
  }

  const handleBack = () => {
    setShowSuperStructureEditor(false)
    setSelectedSuperStructure(null)
  }

  const renderMainContent = () => {
    if (superStructuresData.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-[75vh]'>
          <div className='w-full md:w-1/2'>
            <img
              src={imageConstants.noData}
              alt='No superStructures illustration'
              className='mx-auto md:ml-auto lg:max-w-[200px] w-full'
            />
          </div>
          <div className='text-center md:text-left mt-6 md:mb-0 flex flex-col items-center md:w-1/2'>
            <h3 className='text-2xl'>No SuperStructures there</h3>
            <p className='text-sm text-gray-600'>
              You haven’t created any superStructures. Start by creating your
              first superStructure.
            </p>
          </div>
        </div>
      )
    } else {
      return viewType === 'grid' ? (
        <GridView
          handleShowSuperStructureEditor={handleShowSuperStructureEditor}
          superStructures={superStructuresData}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ) : (
        <ListView
          handleShowSuperStructureEditor={handleShowSuperStructureEditor}
          superStructures={superStructuresData}
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
        <h3 className='flex h-8 flex-col pb-1 text-2xl'>Super Structures</h3>
        {showSuperStructureEditor && (
          <div className='mb-4'>
            <Button onClick={handleBack} className='flex items-center h-8'>
              <ArrowLeft className='mr-2' size={16} />
              Back
            </Button>
          </div>
        )}
      </div>

      <>
        <Header
          setViewType={setViewType}
          viewType={viewType}
          onHandleAddSuperStructure={onHandleAddSuperStructure}
          setSearch={setSearch}
          search={search}
        />

        <Separator className='my-4' />
        {renderMainContent()}
        <ConfirmationDialog
          title='Delete SuperStructure'
          message='Are you sure you want to delete this superStructure?'
          open={openDeleteModal}
          onClose={handleDeleteModalClose}
          onConfirm={onConfirm}
        />
        <NewSuperStructure
          open={openSuperStructureModal}
          onClose={handleCloseSuperStructureModal}
          isEdit={isEdit}
          setFilteredSuperStructures={setFilteredSuperStructures}
          selectedSuperStructure={selectedSuperStructure}
          setOpen={setOpenSuperStructureModal}
        />
      </>
    </div>
  )
}

export default SuperStructures
