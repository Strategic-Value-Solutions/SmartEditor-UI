import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ViewTypeButtons from '@/components/ui/view-type-buttons'
import projectApi from '@/service/projectApi'
import { Download, Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

interface HeaderProps {
  setViewType: (value: string) => void
  viewType: string
  setSearch: (value: string) => void
  search: string
  activeTab: string
  setActiveTab: (value: string) => void
}

const Header = ({
  setViewType,
  viewType,
  setSearch,
  search,
  activeTab,
  setActiveTab,
}: HeaderProps) => {
  const { projectId }: any = useParams()
  const handleViewChange = (value: string) => {
    setViewType(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const downloadReport = async () => {
    try {
      const response = await projectApi.downloadReport(projectId)
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
          >
            Download report
            <Download size={20} />
          </Button>
          <Button
            onClick={() => toast.info('Coming soon')}
            className='flex h-8 items-center justify-center gap-2 p-2'
          >
            New Project Model
            <Plus size={20} />
          </Button>
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
