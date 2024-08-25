//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Grid2X2, List, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const Header = ({ setViewType, viewType, setSearch, search }) => {
  const handleViewChange = (value) => {
    setViewType(value)
  }

  return (
    <div className='p-y-3 mt-4 flex w-full flex-row justify-between'>
      <Input
        placeholder='Search project model...'
        className='w-[20vw]'
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
          {/* <TabsContent value='overview' className='space-y-4'></TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}

export default Header
