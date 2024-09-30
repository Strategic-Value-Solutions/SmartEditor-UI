import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RootState } from '@/store'
import { hasProjectWriteAccess } from '@/utils'
import { useSelector } from 'react-redux'

interface TabsProps {
  activeTab: string
  handleTabChange: (value: string) => void
}

const ProjectTabs: React.FC<TabsProps> = ({ activeTab, handleTabChange }) => {
  const currentProject = useSelector(
    (state: RootState) => state.project.currentProject
  )

  return (
    <div className=''>
      <Tabs
        orientation='horizontal'
        defaultValue={activeTab}
        onValueChange={handleTabChange}
      >
        <div className='w-full overflow-x-auto'>
          <TabsList className='flex justify-start space-x-4 border-b border-gray-200'>
            <TabsTrigger value='projectModels'>Project Models</TabsTrigger>
            <TabsTrigger value='analytics'>Analytics</TabsTrigger>
            {hasProjectWriteAccess(currentProject?.permission) && (
              <TabsTrigger value='settings'>Settings</TabsTrigger>
            )}
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}

export default ProjectTabs
