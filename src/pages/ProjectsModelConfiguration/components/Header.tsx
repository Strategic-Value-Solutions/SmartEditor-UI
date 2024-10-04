//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ViewTypeButtons from '@/components/ui/view-type-buttons'
import { Plus } from 'lucide-react'

const Header = ({
  setViewType,
  viewType,
  setSearch,
  search,
  onHandleAddModelConfiguration,
}) => {
  const handleViewChange = (value) => {
    setViewType(value)
  }

  return (
    <div className='p-y-3 mt-4 flex w-full flex-row justify-between lg:gap-0 gap-2 '>
      <Input
        placeholder='Search configuration...'
        className='lg:w-[20vw]'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className='flex flex-row items-center justify-end gap-2'>
        <Button
          onClick={onHandleAddModelConfiguration}
          className='flex h-8 items-center justify-center gap-2 p-2'
          id='new-configuration'
        >
          New Configuration
          <Plus size={20} />
        </Button>
        <ViewTypeButtons
          handleViewChange={handleViewChange}
          viewType={viewType}
        />
      </div>
    </div>
  )
}

export default Header
