import Collaborators from './components/Collaborators/Collaborators'
import ProjectAccess from './components/ProjectAccess/ProjectAccess'
import { Settings, Users } from 'lucide-react'
import React, { useState } from 'react'

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('general')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <ProjectAccess />
      case 'collaborators':
        return <Collaborators />
      default:
        return <div className='text-gray-700'>General Settings Content</div>
    }
  }

  return (
    <div className='flex flex-col lg:flex-row h-full text-sm'>
      {/* Left side: Vertical Tabs */}
      <div className='w-full lg:w-1/6 h-full bg-white p-4'>
        <ul className='space-y-2'>
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition ${
              activeTab === 'general'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('general')}
          >
            <Settings className='mr-2' size={16} />
            Project Access
          </li>
          <li
            className={`flex items-center cursor-pointer p-2 rounded-md transition ${
              activeTab === 'collaborators'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('collaborators')}
          >
            <Users className='mr-2' size={16} />
            Collaborators
          </li>
        </ul>
      </div>

      {/* Right side: Tab Content */}
      <div className='w-full lg:w-5/6 h-full p-6 lg:ml-4'>
        <div className='p-4 bg-white rounded-md border border-gray-300'>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
