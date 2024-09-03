import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Grid2X2, List } from 'lucide-react'

interface ViewTypeButtonsProps {
  handleViewChange: (value: string) => void
  viewType: string
}

function ViewTypeButtons({ handleViewChange, viewType }: ViewTypeButtonsProps) {
  return (
    <Tabs
      orientation='vertical'
      defaultValue={viewType}
      onValueChange={handleViewChange}
      className='space-y-4'
    >
      <div className='w-full overflow-x-auto'>
        <TabsList>
          <TabsTrigger value='list'>
            <List />
          </TabsTrigger>
          <TabsTrigger value='grid'>
            <Grid2X2 />
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  )
}

export default ViewTypeButtons
