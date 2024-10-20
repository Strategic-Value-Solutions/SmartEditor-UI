//@ts-nocheck
import NewSubStructure from './components/Dialog/NewSubStructure'
import Header from './components/Header'
import SubStructureEditor from './components/SubStructureEditor'
import GridView from './components/Views/GridView'
import ListView from './components/Views/ListView'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/confirmation-dialog'
import { Separator } from '@/components/ui/separator'
import imageConstants from '@/constants/imageConstants'
import subStructureApi from '@/service/subStructureApi'
import { RootState } from '@/store'
import {
  deleteSubStructure,
  setSubStructureData,
} from '@/store/slices/subStructureSlice'
import { getErrorMessage } from '@/utils'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const SubStructures = () => {
  const subStructuresData = useSelector(
    (state: RootState) => state?.subStructure?.subStructureData || []
  )
  const { superStructureId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [viewType, setViewType] = useState('grid')
  const [search, setSearch] = useState('')
  const [filteredSubStructures, setFilteredSubStructures] = useState([])
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedSubStructure, setSelectedSubStructure] = useState<any>(null)
  const [showSubStructureEditor, setShowSubStructureEditor] = useState(false)
  const [openSubStructureModal, setOpenSubStructureModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const isSubStructureTourCompleted =
    localStorage.getItem('subStructureTourCompleted')?.toString() === 'true'
  const handleEditButtonClick = (subStructure: any) => {
    setSelectedSubStructure(subStructure)
    setIsEdit(true)
    setOpenSubStructureModal(true)
  }

  const handleDeleteButtonClick = (subStructure: any) => {
    setSelectedSubStructure(subStructure)
    setOpenDeleteModal(true)
  }

  const handleDeleteModalClose = () => {
    setOpenDeleteModal(false)
    setSelectedSubStructure(null)
  }

  const onConfirm = async () => {
    if (!selectedSubStructure?.id) {
      toast.error('Please select a subStructure to delete')
      return
    }
    try {
      setLoading(true)
      await subStructureApi.deleteSubStructure(
        superStructureId,
        selectedSubStructure.id
      )
      dispatch(deleteSubStructure(selectedSubStructure.id))
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
      handleDeleteModalClose()
    }
  }

  const onHandleAddSubStructure = () => {
    setSelectedSubStructure(null)
    setIsEdit(false)
    setOpenSubStructureModal(true)
  }

  const handleCloseSubStructureModal = () => {
    setOpenSubStructureModal(false)
    setSelectedSubStructure(null)
    setIsEdit(false)
  }

  useEffect(() => {
    if (search === '') {
      if (filteredSubStructures.length !== subStructuresData.length) {
        setFilteredSubStructures(subStructuresData)
      }
    } else {
      const filtered = subStructuresData.filter((subStructure: any) =>
        subStructure.name.toLowerCase().includes(search.toLowerCase())
      )
      if (JSON.stringify(filtered) !== JSON.stringify(filteredSubStructures)) {
        setFilteredSubStructures(filtered)
      }
    }
  }, [search, subStructuresData, filteredSubStructures])

  useEffect(() => {
    const fetchSubStructures = async () => {
      try {
        setLoading(true)
        const response =
          await subStructureApi.getSubStructures(superStructureId)

        dispatch(setSubStructureData(response))
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    fetchSubStructures()
  }, [dispatch])

  const handleBack = () => {
    setShowSubStructureEditor(false)
    setSelectedSubStructure(null)
  }

  const renderMainContent = () => {
    if (subStructuresData.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center h-[75vh]'>
          <div className='w-full md:w-1/2'>
            <img
              src={imageConstants.noData}
              alt='No sub structures illustration'
              className='mx-auto md:ml-auto lg:max-w-[200px] w-full'
            />
          </div>
          <div className='text-center md:text-left mt-6 md:mb-0 flex flex-col items-center md:w-1/2'>
            <h3 className='text-2xl'>No Sub Structures there</h3>
            <p className='text-sm text-gray-600'>
              You haven’t created any sub structures. Start by creating your
              first sub structure.
            </p>
          </div>
        </div>
      )
    } else {
      return viewType === 'grid' ? (
        <GridView
          subStructures={subStructuresData}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ) : (
        <ListView
          subStructures={subStructuresData}
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
        <h3 className='flex h-8 flex-col pb-1 text-2xl'>Sub Structures</h3>
        {showSubStructureEditor && (
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
          onHandleAddSubStructure={onHandleAddSubStructure}
          setSearch={setSearch}
          search={search}
        />

        <Separator className='my-4' />
        {renderMainContent()}
        <ConfirmationDialog
          title='Delete sub structure'
          message='Are you sure you want to delete this sub structure?'
          open={openDeleteModal}
          onClose={handleDeleteModalClose}
          onConfirm={onConfirm}
        />
        <NewSubStructure
          open={openSubStructureModal}
          onClose={handleCloseSubStructureModal}
          isEdit={isEdit}
          setFilteredSubStructures={setFilteredSubStructures}
          selectedSubStructure={selectedSubStructure}
          setOpen={setOpenSubStructureModal}
        />
      </>
    </div>
  )
}

export default SubStructures
