import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ViewTypeButtons from '@/components/ui/view-type-buttons'
import projectApi from '@/service/projectApi'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import NewProjectModal from './NewProjectModal'

interface HeaderProps {
  setViewType: (value: string) => void
  viewType: string
  setSearch: (value: string) => void
  search: string
  setShowCreatePickModal: (value: boolean) => void
  setActiveTab: (value: string) => void
}

const Header = ({
  setViewType,
  viewType,
  setSearch,
  search,
  setShowCreatePickModal,
  setActiveTab,
}: HeaderProps) => {
  const { projectId }: any = useParams()

  const [isLoading, setIsLoading] = useState(false)

  const handleViewChange = (value: string) => {
    setViewType(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const downloadReport = async () => {
    try {
      setIsLoading(true)
      const response = await projectApi.downloadReport(projectId)
      setIsLoading(false)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='mt-4 w-full'>
      {/* Top Section: Search, New Project Button, View Type Buttons */}
      <div className='flex flex-row justify-between'>
        <Input
          placeholder='Search project model...'
          className='w-[20vw]'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className='flex flex-row items-center justify-end gap-2'>
          <Button
            onClick={() => downloadReport()}
            className='flex h-8 items-center justify-center gap-2 p-2'
            disabled={isLoading}
          >
            {isLoading ? 'Downloading...' : 'Download report'}
            <Download size={20} />
          </Button>
          <NewProjectModal />
          <ViewTypeButtons
            handleViewChange={handleViewChange}
            viewType={viewType}
          />
        </div>
      </div>
    </div>
  )
}

export default Header
