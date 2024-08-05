import { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import TemplateCard from './components/TemplateCard'
import { RootState } from '@/store'

const Templates = () => {
  const [openModal, setOpenModal] = useState(false)

  const templatesData = useSelector(
    (state: RootState) => state.template.templatesData || []
  )
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
        {templatesData.map((config: any) => (
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

export default Templates
