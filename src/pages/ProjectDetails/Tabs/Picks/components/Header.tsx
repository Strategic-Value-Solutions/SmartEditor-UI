import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ViewTypeButtons from '@/components/ui/view-type-buttons'
import { Plus } from 'lucide-react'
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
  const handleViewChange = (value: string) => {
    setViewType(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className='mt-4 w-full'>
      {/* Top Section: Search, New Project Button, View Type Buttons */}
      <div className='flex flex-row justify-between'>
        <Input
          placeholder='Search project model...'
          className='w-[20vw]'
          onFocus={() => toast.info('Coming soon')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className='flex flex-row items-center justify-end gap-2'>
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
