import { Grid2X2, List } from 'lucide-react'
import { Input } from '../ui/input'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import NewProject from './Dialog/NewProject'

const Header = () => {
  return (
    <div className='ml-3 mt-4 flex w-full flex-row justify-between'>
      <Input placeholder='Search project...' className='w-[20vw]' />
      <div className='flex flex-row items-center justify-end gap-2'>
        <NewProject />
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto'>
            <TabsList>
              <TabsTrigger value='list'>
                {' '}
                <List />
              </TabsTrigger>
              <TabsTrigger value='grid'>
                {' '}
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
