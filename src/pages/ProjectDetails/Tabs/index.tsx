import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsProps {
  activeTab: string
  handleTabChange: (value: string) => void
}

const ProjectTabs: React.FC<TabsProps> = ({ activeTab, handleTabChange }) => (
  <div className=''>
    <Tabs
      orientation='horizontal'
      defaultValue={activeTab}
      onValueChange={handleTabChange}
    >
      <div className='w-full overflow-x-auto'>
        <TabsList className='flex justify-start space-x-4 border-b border-gray-200'>
          <TabsTrigger value='projectModels'>Project Models</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  </div>
)

export default ProjectTabs
