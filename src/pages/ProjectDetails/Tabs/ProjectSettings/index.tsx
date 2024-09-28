import ProjectInfo from './ProjectInfo'
import Collaborators from './components/Collaborators/Collaborators'
import Events from './components/Event/Event'
import Invitations from './components/Invitations/Invitations'
import ModelAccess from './components/ModelAccess/ModelAccess'
import { Mail, Settings, Users, Webhook } from 'lucide-react'
import { useState } from 'react'

const ProjectSettings = () => {
  const [activeTab, setActiveTab] = useState('collaborators')

  const tabs = [
    {
      name: 'Project Info',
      key: 'projectInfo',
      icon: Settings,
      component: <ProjectInfo />,
    },
    {
      name: 'Collaborators',
      key: 'collaborators',
      icon: Users,
      component: <Collaborators />,
    },
    {
      name: 'Model Access',
      key: 'modelAccess',
      icon: Settings,
      component: <ModelAccess />,
    },
    {
      name: 'Invitations',
      key: 'invitations',
      icon: Mail,
      component: <Invitations />,
    },
    { name: 'Events', key: 'events', icon: Webhook, component: <Events /> },
  ]

  const renderTabContent = () => {
    const tabComponents = {
      projectInfo: ProjectInfo,
      modelAccess: ModelAccess,
      collaborators: Collaborators,
      invitations: Invitations,
      events: Events,
    }

    const TabComponent = tabComponents[activeTab as keyof typeof tabComponents]
    return TabComponent ? <TabComponent /> : null
  }

  return (
    <div className='flex flex-col lg:flex-row h-full text-sm overflow-y-auto'>
      {/* Left side: Vertical Tabs */}
      <div className='w-full lg:w-1/6 h-full bg-white p-4'>
        <ul className='space-y-2'>
          {tabs.map((tab) => (
            <li
              key={tab.key}
              className={`flex items-center cursor-pointer p-2 rounded-md transition ${
                activeTab === tab.key
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon className='mr-2' size={16} />
              {tab.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Right separator */}
      <div className='hidden lg:block w-px bg-gray-200 mx-4 h-full'></div>

      {/* Right side: Tab Content */}
      <div className='w-full lg:w-5/6 h-full p-6 lg:ml-4'>
        <div className='p-4 bg-white rounded-md border border-gray-300'>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default ProjectSettings
