//@ts-nocheck
import ProjectModels from './Tabs/Picks'
import ProjectSettings from './Tabs/ProjectSettings'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import ProjectTabs from './Tabs'

const ProjectDetails = () => {
  const { projectId } = useParams()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [activeTab, setActiveTab] = useState('projectModels')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'projectModels':
        return <ProjectModels />
      case 'settings':
        return <ProjectSettings />
      default:
        return <div>Coming soon</div>
    }
  }

  return (
    <div className='flex flex-col h-full'>
      <ProjectTabs activeTab={activeTab} handleTabChange={setActiveTab} />
      <div className='mt-4'>{renderActiveTab()}</div>
    </div>
  )
}

export default ProjectDetails
