import { useContext, useState } from 'react'
import TemplateCard from '../components/Templates/TemplateCard'
import { ProjectDataContext } from '../store/ProjectDataContext'
import Header from '@/components/Templates/Header'

const Template = () => {
  const [openModal, setOpenModal] = useState(false)

  const { configsData } = useContext(ProjectDataContext)

  const handleNewButtonClick = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const refreshConfigs = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/configmodels/')
      const data = await response.json()
      // updateConfigsData(data)
    } catch (error) {
      console.error('Failed to fetch configurations:', error)
    }
  }

  return (
    <div className='flex flex-col'>
      <h3 className='flex h-8 flex-col pb-1 text-2xl'>Templates</h3>
      <Header />
      <div className='mt-4 inline-flex flex-row flex-wrap gap-2 overflow-hidden'>
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
        {configsData.map((config: any) => (
          <TemplateCard
            key={config.mcc}
            id={config.mcc}
            title={`${config.model_name}`}
            refreshConfigs={refreshConfigs}
          />
        ))}
      </div>
    </div>
  )
}

export default Template
